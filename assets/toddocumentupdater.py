# Windows-only automation with a simple GUI:
# - Drag-and-drop Word files/folders or browse to pick them
# - Exports to Filtered HTML, sends to Navigator Chat via Playwright, reimports to DOCX using a seed template
# - Forces Word "Print Layout" view in the saved DOCX
#
# Dev/build prerequisites:
#   pip install pywin32 playwright pyinstaller tkinterdnd2
#   python -m playwright install chromium

import os
import re
import sys
import time
import threading
import tempfile
import traceback
import datetime
import html
import shutil
from pathlib import Path

import pythoncom
import pywintypes
import win32com.client as win32
from playwright.sync_api import sync_playwright

# ---------- GUI (Tkinter + tkinterdnd2 for drag-and-drop) ----------
import tkinter as tk
from tkinter import ttk, filedialog, messagebox
try:
    from tkinterdnd2 import DND_FILES, TkinterDnD
    TKDND_AVAILABLE = True
except Exception:
    TKDND_AVAILABLE = False

# ---------- Ensure Playwright uses the bundled Chromium ----------
def setup_playwright_browsers_path():
    exe_dir = Path(sys.executable).parent if getattr(sys, "frozen", False) else Path(__file__).parent
    candidates = [
        Path(getattr(sys, "_MEIPASS", exe_dir)) / "ms-playwright",  # onefile extract dir
        exe_dir / "ms-playwright",                                   # onedir layout
    ]
    for p in candidates:
        if p.exists():
            os.environ["PLAYWRIGHT_BROWSERS_PATH"] = str(p)
            return
setup_playwright_browsers_path()

# ---------- Word constants ----------
WD_FORMAT_FILTERED_HTML = 10
WD_FORMAT_XML_DOCUMENT  = 12
WD_LIST_BULLET          = 2
WD_LIST_NUMBERED        = 3
WD_STYLE_TYPE_PARAGRAPH = 1
WD_VIEW_PRINT           = 3
RPC_E_CALL_REJECTED     = -2147418111  # 0x80010001
RPC_E_RETRY_LATER       = -2147417848  # 0x8001010A

# ---------- Navigator Chat URL ----------
NAVIGATOR_CHAT_URL = "https://chat.ai.it.ufl.edu/"

# ---------- Optional seed template (fallback to Normal.dotm if missing) ----------
def resolve_seed_template(name: str = "seed_template.dotx") -> str:
    base = Path(sys.executable).parent if getattr(sys, "frozen", False) else Path(__file__).parent
    p = base / name
    if p.exists():
        return str(p)
    if hasattr(sys, "_MEIPASS"):
        p = Path(sys._MEIPASS) / name
        if p.exists():
            return str(p)
    return ""

SEED_TEMPLATE_PATH = resolve_seed_template()

# ---------- Prompt ----------
PROMPT_TEXT = """You are a converter that takes raw HTML (exported from Word or similar) and returns a cleaned HTML5 document that maps to Word’s Normal.dotm styles on import. Change text semantics and add only style-name bridges; do not define or modify visual formatting.
Process ONLY the HTML between <BEGIN_HTML> and <END_HTML>. Ignore everything else, and do not repeat or quote the prompt.
Preservation:
- Keep all <img> tags unchanged. Do not alter src or alt, do not rename files, do not inline/base64 images, do not reorder images.
- Do not remove namespaced elements tied to image rendering (e.g., v:imagedata); leave them as-is.
- Preserve existing <a href="…"> anchors.
Output:
- Output ONLY one raw HTML5 document (no code fences or commentary).
- Use <html lang="en">, include <meta charset="utf-8">, and set <title> to exactly match the first visible <h1>.
- Include exactly one <style> in <head> with ONLY these bridges (verbatim):
p.Note { mso-style-name:"Note"; }
span.ClicksChar { mso-style-name:"Clicks Char"; }
p.BulletedList { mso-style-name:"Bulleted List"; }
- No other CSS. No external stylesheets, scripts, fonts, iframes, or base64 assets.
Strip and simplify:
- Remove existing <style> blocks and inline styles on text, except minimal align/width on images already present.
- Do not use tables for layout; never wrap images in tables; keep images in plain <p> blocks.
- Remove non-semantic classes from text elements; keep only class="Note" for notes, class="ClicksChar" spans, and class="BulletedList" for unordered-list item paragraphs.
- Convert <b>/<i> -> <strong>/<em>. Remove disallowed attributes and event handlers.
Structure and mapping:
- Headings: ensure one top-level <h1> (document title) that mirrors <title>, then use <h2> for sections, <h3> for subsections; don’t skip levels; use <h4–h6> only if clearly needed.
- Paragraphs: default body text -> <p> (no class). Plain <p> must import as Word’s “Normal” style (no classes, no inline styles).
- Lists:
  - Unordered lists: EVERY item must be <li><p class="BulletedList">Item text…</p></li>.
  - Ordered lists: <ol> with items as <li>Item text…</li>.
- Notes: <p class="Note"><strong>Note:</strong> …</p> or <p class="Note"><strong>Warning:</strong> …</p>.
- Clicks: wrap UI labels in <span class="ClicksChar">…</span>.
- Tables: simple tables; wrap text inside th/td with <p>.
- Quotes: <blockquote><p>…</p></blockquote>.
- Code: avoid <pre>; use <p><code>…</code></p> + <br>.
- Links: preserve <a>; for plain URLs, use <a href="…">…</a>.
Self-check:
- Confirm all <img> src/alt unchanged.
- Exactly one <style> with the three bridges.
- First visible heading is a single <h1> that matches <title>.
- Unordered-list items contain <p class="BulletedList">.
- No code fences or commentary outside the HTML.
"""

# ---------- Sign-in flow (browser opens after instructions) ----------
def ensure_profile_signed_in_gui(user_data_dir: str, log_fn):
    play = sync_playwright().start()
    context = play.chromium.launch_persistent_context(
        user_data_dir=user_data_dir,
        headless=False,
        args=["--disable-features=IsolateOrigins,site-per-process"]
    )
    page = context.new_page()
    page.goto(NAVIGATOR_CHAT_URL, wait_until="load")
    try:
        page.wait_for_load_state("networkidle", timeout=15000)
    except Exception:
        pass
    log_fn("Navigator Chat opened with your persistent profile. Complete sign-in and set the default model if needed.")
    # After they finish in the browser, they acknowledge and we proceed
    messagebox.showinfo("After sign-in", "When the chat input is visible and you’ve finished the setup in the browser,\nclick OK here to begin processing.")
    try:
        context.close()
    except Exception:
        pass
    try:
        play.stop()
    except Exception:
        pass

# ---------- Utilities ----------
def timestamp():
    return datetime.datetime.now().strftime("%Y%m%d_%H%M%S")

def norm_path(p: str) -> str:
    return os.path.normpath(os.path.abspath(p)).replace("/", "\\")

def with_retry(fn, *args, **kwargs):
    backoff = 0.1
    for _ in range(50):
        try:
            return fn(*args, **kwargs)
        except pywintypes.com_error as e:
            hr = getattr(e, "hresult", None)
            if hr is None and e.args:
                hr = e.args[0]
            if hr in (RPC_E_CALL_REJECTED, RPC_E_RETRY_LATER):
                pythoncom.PumpWaitingMessages()
                time.sleep(backoff)
                backoff = min(backoff * 1.5, 1.5)
                continue
            raise

# ---------- High-quality image settings ----------
def set_high_quality(word, doc=None):
    try:
        word.Options.DoNotCompressImages = True
    except Exception:
        pass
    try:
        word.Options.DefaultTargetDocumentResolution = 600
    except Exception:
        pass
    if doc is not None:
        try:
            wo = doc.WebOptions
            wo.AllowPNG = True
            wo.PixelsPerInch = 300
        except Exception:
            pass

# ---------- Word open/save helpers ----------
def open_word_document_forgiving(word, path: str):
    p = norm_path(path)
    if not os.path.isfile(p):
        raise FileNotFoundError(f"Not a file: {p}")
    try:
        return with_retry(
            word.Documents.Open,
            FileName=p,
            ConfirmConversions=False,
            ReadOnly=True,
            AddToRecentFiles=False,
            Revert=False,
            WritePasswordDocument="",
            WritePasswordTemplate="",
            OpenAndRepair=False,
            NoEncodingDialog=True
        )
    except pywintypes.com_error:
        try:
            pv = with_retry(word.ProtectedViewWindows.Open, FileName=p, AddToRecentFiles=False)
            time.sleep(0.25)
            doc = with_retry(pv.Edit)
            try:
                doc.ReadOnlyRecommended = True
            except Exception:
                pass
            return doc
        except Exception as e:
            raise e

def save_as_filtered_html(doc, html_path: str):
    html_path = norm_path(html_path)
    try:
        with_retry(doc.SaveAs2, FileName=html_path, FileFormat=WD_FORMAT_FILTERED_HTML)
    except AttributeError:
        with_retry(doc.SaveAs, FileName=html_path, FileFormat=WD_FORMAT_FILTERED_HTML)

def export_doc_to_filtered_html(docx_path: str):
    pythoncom.CoInitialize()
    word = None
    doc = None
    try:
        word = win32.Dispatch("Word.Application")
        word.Visible = False
        word.DisplayAlerts = 0
        doc = open_word_document_forgiving(word, docx_path)
        set_high_quality(word, doc)
        base = os.path.splitext(os.path.basename(docx_path))[0]
        short_base = re.sub(r"[^A-Za-z0-9._-]+", "_", base)[:40] or "doc"
        out_dir = os.path.join(tempfile.gettempdir(), f"html_{short_base}_{timestamp()}")
        os.makedirs(out_dir, exist_ok=True)
        html_path = os.path.join(out_dir, f"{short_base}.html")
        save_as_filtered_html(doc, html_path)
        assets_dir_guess = os.path.join(out_dir, f"{short_base}_files")
        assets_dir = assets_dir_guess if os.path.isdir(assets_dir_guess) else out_dir
        return html_path, assets_dir, short_base
    finally:
        try:
            if doc is not None:
                doc.Close(False)
        except Exception:
            pass
        try:
            if word is not None:
                word.Quit()
        except Exception:
            pass
        try:
            pythoncom.CoUninitialize()
        except Exception:
            pass

# ---------- HTML extraction ----------
def extract_relevant_html_for_ai(full_html: str) -> str:
    body_match = re.search(r"(?is)<body[^>]*>(.*?)</body>", full_html)
    body_html = body_match.group(1) if body_match else full_html
    body_html = re.sub(r"(?is)<style[^>]*>.*?</style>", "", body_html)
    body_html = re.sub(r"(?is)<script[^>]*>.*?</script>", "", body_html)
    body_html = re.sub(r"(?is)<link[^>]*?>", "", body_html)
    body_html = re.sub(r"(?is)<!--.*?-->", "", body_html)
    return body_html.strip()

# ---------- Work staging (images) ----------
def make_work_dir(docx_path: str, short_base: str) -> str:
    parent = os.path.dirname(norm_path(docx_path))
    work = os.path.join(parent, f"ADA_work_{short_base}_{timestamp()}")
    os.makedirs(work, exist_ok=True)
    return work

def copy_all(src_dir: str, dst_dir: str):
    if not os.path.isdir(src_dir):
        return
    os.makedirs(dst_dir, exist_ok=True)
    for name in os.listdir(src_dir):
        sp = os.path.join(src_dir, name)
        dp = os.path.join(dst_dir, name)
        if os.path.isfile(sp):
            try:
                shutil.copy2(sp, dp)
            except Exception:
                pass

def relativize_img_src_to_folder(body_html: str, target_dir: str, original_assets_dir: str) -> str:
    def repl(m):
        src = m.group(1).strip()
        if re.match(r'(?i)^data:', src):
            return m.group(0)
        local = None
        if re.match(r'(?i)^[A-Za-z]:', src) and os.path.isfile(src):
            local = src
        elif src.startswith("file:///"):
            p = src.replace("file:///", "").replace("/", "\\")
            if os.path.isfile(p):
                local = p
        else:
            cand = norm_path(os.path.join(original_assets_dir, src))
            if os.path.isfile(cand):
                local = cand
            else:
                b = os.path.basename(src)
                cand2 = norm_path(os.path.join(original_assets_dir, b))
                if os.path.isfile(cand2):
                    local = cand2
        if local and os.path.isfile(local):
            fname = os.path.basename(local)
            dst_path = os.path.join(target_dir, fname)
            try:
                if norm_path(local) != norm_path(dst_path):
                    shutil.copy2(local, dst_path)
            except Exception:
                pass
            return f'src="{fname}"'
        return m.group(0)
    return re.sub(r'(?is)\bsrc="([^"]+)"', repl, body_html)

def package_for_ai(body_html: str, assets_dir: str, work_dir: str) -> str:
    body_html = relativize_img_src_to_folder(body_html, work_dir, assets_dir)
    return f"{PROMPT_TEXT}\n\n<BEGIN_HTML>\n{body_html}\n</END_HTML>\n"

# ---------- Post-AI cleanup ----------
_PROMPT_SIGNS = [
    "mso-style-name", "preservation:", "output:", "strip and simplify",
    "structure and mapping", "list detection", "self-check"
]

def strip_leaked_prompt_from_html(ai_html: str) -> str:
    try:
        m = re.search(r'(?is)<body[^>]*>(.*)</body>', ai_html)
        if not m:
            return ai_html
        body = m.group(1)
        h1m = re.search(r'(?is)<h1\b', body)
        if h1m:
            prefix = body[:h1m.start()]
            if any(sig in prefix.lower() for sig in _PROMPT_SIGNS):
                body = body[h1m.start():]
        for sig in _PROMPT_SIGNS:
            rx = re.compile(rf'(?is)<(p|li)[^>]*>[^<]*{re.escape(sig)}[^<]*</\1>')
            body = rx.sub("", body)
        body = re.sub(r'(?is)^\s*(<ul>.*?</ul>\s*)+', "", body)
        return re.sub(r'(?is)(<body[^>]*>).*?(</body>)', rf"\1{body}\2", ai_html)
    except Exception:
        return ai_html

def rebase_img_src_to_existing(ai_html: str, work_dir: str, original_assets_dir: str) -> str:
    def find_existing(src: str):
        if re.match(r'(?i)^data:', src):
            return None
        if re.match(r'(?i)^[A-Za-z]:', src) and os.path.isfile(src):
            return src
        if src.startswith("file:///"):
            p = src.replace("file:///", "").replace("/", "\\")
            if os.path.isfile(p):
                return p
        cand = norm_path(os.path.join(work_dir, src))
        if os.path.isfile(cand):
            return cand
        cand2 = norm_path(os.path.join(original_assets_dir, src))
        if os.path.isfile(cand2):
            return cand2
        b = os.path.basename(src)
        for root in (work_dir, original_assets_dir):
            hit = norm_path(os.path.join(root, b))
            if os.path.isfile(hit):
                return hit
        return None
    def repl(m):
        raw = m.group(0)
        src = m.group(1).strip()
        found = find_existing(src)
        if not found:
            return raw
        fname = os.path.basename(found)
        dst = os.path.join(work_dir, fname)
        try:
            if norm_path(found) != norm_path(dst):
                shutil.copy2(found, dst)
        except Exception:
            pass
        return raw.replace(src, fname)
    return re.sub(r'(?is)<img[^>]+src="([^"]+)"', repl, ai_html)

# ---------- HTML preprocessing ----------
_LI_SINGLE_P_NOT_BULLET_RE = re.compile(
    r'(?is)<li>\s*<p(?![^>]*\bclass\s*=\s*["\'][^"\']*\bBulletedList\b)[^>]*>(.*?)</p>\s*</li>'
)

def preprocess_html_for_word(html_in: str) -> str:
    try:
        return _LI_SINGLE_P_NOT_BULLET_RE.sub(r"<li>\1</li>", html_in)
    except Exception:
        return html_in

# ---------- Post-import fixes ----------
def flatten_image_only_tables(doc_out):
    try:
        for i in range(doc_out.Tables.Count, 0, -1):
            t = doc_out.Tables(i)
            try:
                if t.Rows.Count != 1 or t.Columns.Count != 1:
                    continue
                cell_rng = t.Cell(1, 1).Range
                txt = cell_rng.Text.replace("\r", "").replace("\x07", "").strip()
                has_text = bool(txt)
                has_pics = (cell_rng.InlineShapes.Count > 0) or (cell_rng.Shapes.Count > 0)
                if not has_pics or has_text:
                    continue
                after_rng = t.Range
                after_rng.Collapse(0)
                for n in range(cell_rng.Shapes.Count, 0, -1):
                    shp = cell_rng.Shapes(n)
                    try:
                        ish = shp.ConvertToInlineShape()
                        ish.Range.Cut()
                        with_retry(after_rng.Paste)
                        after_rng.Collapse(0)
                    except Exception:
                        pass
                for n in range(cell_rng.InlineShapes.Count, 0, -1):
                    ish = cell_rng.InlineShapes(n)
                    try:
                        ish.Range.Cut()
                        with_retry(after_rng.Paste)
                        after_rng.Collapse(0)
                    except Exception:
                        pass
                t.Delete()
            except Exception:
                pass
    except Exception:
        pass

_BULLET_CHARS = "\u2022•\u00B7-"
_BULLET_RE = re.compile(r'^\s*([%s])\s+' % re.escape(_BULLET_CHARS))
_NUMBER_RE = re.compile(r'^\s*((\(?\d+[\.\)])|([A-Za-z][\.\)]))\s+')

def _classify_marker(text: str):
    t = text.rstrip("\r\n")
    m = _BULLET_RE.match(t)
    if m:
        return "bullet", len(m.group(0))
    m = _NUMBER_RE.match(t)
    if m:
        return "numbered", len(m.group(0))
    return None, 0

def enforce_lists(doc_out):
    try:
        i = 1
        while i <= doc_out.Paragraphs.Count:
            p = doc_out.Paragraphs(i)
            try:
                lt = p.Range.ListFormat.ListType
                if lt in (WD_LIST_BULLET, WD_LIST_NUMBERED):
                    i += 1
                    continue
            except Exception:
                pass
            text = p.Range.Text
            kind, prelen = _classify_marker(text)
            if not kind:
                i += 1
                continue
            start = i
            j = i + 1
            while j <= doc_out.Paragraphs.Count:
                pj = doc_out.Paragraphs(j)
                try:
                    ltj = pj.Range.ListFormat.ListType
                    if ltj in (WD_LIST_BULLET, WD_LIST_NUMBERED):
                        break
                except Exception:
                    pass
                kindj, _ = _classify_marker(pj.Range.Text)
                if kindj != kind:
                    break
                j += 1
            end = j - 1
            for k in range(start, end + 1):
                pk = doc_out.Paragraphs(k)
                kindk, prelenk = _classify_marker(pk.Range.Text)
                if kindk and prelenk > 0:
                    try:
                        del_range = doc_out.Range(Start=pk.Range.Start, End=pk.Range.Start + prelenk)
                        del_range.Text = ""
                    except Exception:
                        pass
            try:
                grp = doc_out.Range(Start=doc_out.Paragraphs(start).Range.Start,
                                    End=doc_out.Paragraphs(end).Range.End)
                if kind == "bullet":
                    with_retry(grp.ListFormat.ApplyBulletDefault)
                else:
                    with_retry(grp.ListFormat.ApplyNumberDefault)
            except Exception:
                pass
            i = end + 1
    except Exception:
        pass

def apply_bulleted_list_style(doc_out, style_name="Bulleted List"):
    try:
        s = doc_out.Styles(style_name)
    except Exception:
        return
    for p in doc_out.Paragraphs:
        try:
            lt = p.Range.ListFormat.ListType
            if lt == WD_LIST_BULLET:
                p.Style = s
        except Exception:
            pass

def ensure_numbered_list_paragraphs(doc_out):
    try:
        list_para = doc_out.Styles("List Paragraph")
    except Exception:
        try:
            list_para = with_retry(doc_out.Styles.Add, "List Paragraph", WD_STYLE_TYPE_PARAGRAPH)
        except Exception:
            list_para = None
    if list_para is None:
        return
    for p in doc_out.Paragraphs:
        try:
            lt = p.Range.ListFormat.ListType
            if lt == WD_LIST_NUMBERED:
                p.Style = list_para
        except Exception:
            pass

def ensure_normal_paragraphs(doc_out):
    try:
        normal_style = doc_out.Styles("Normal")
    except Exception:
        return
    for p in doc_out.Paragraphs:
        try:
            try:
                name = str(p.Style.NameLocal)
            except Exception:
                name = ""
            name_lower = name.lower()
            try:
                lt = p.Range.ListFormat.ListType
                if lt in (WD_LIST_BULLET, WD_LIST_NUMBERED):
                    continue
            except Exception:
                pass
            if name_lower.startswith("heading") or name in ("List Paragraph", "Note", "Bulleted List"):
                continue
            if name != "Normal" and ("normal" in name_lower or name in ("", "HTML Normal", "Normal (Web)")):
                with_retry(setattr, p, "Style", normal_style)
        except Exception:
            pass

def embed_images_and_break_links(doc_out):
    try:
        flds = doc_out.Fields
        for i in range(flds.Count, 0, -1):
            try:
                fld = flds(i)
                code = ""
                try:
                    code = str(fld.Code.Text or "")
                except Exception:
                    pass
                if "INCLUDEPICTURE" in code.upper():
                    with_retry(fld.Unlink)
            except Exception:
                pass
    except Exception:
        pass
    try:
        for i in range(doc_out.InlineShapes.Count, 0, -1):
            ish = doc_out.InlineShapes(i)
            try:
                lf = ish.LinkFormat
            except Exception:
                lf = None
            if lf:
                try:
                    lf.SavePictureWithDocument = True
                except Exception:
                    pass
                try:
                    with_retry(lf.BreakLink)
                except Exception:
                    pass
    except Exception:
        pass
    try:
        for i in range(doc_out.Shapes.Count, 0, -1):
            shp = doc_out.Shapes(i)
            try:
                lf = shp.LinkFormat
            except Exception:
                lf = None
            if lf:
                try:
                    lf.SavePictureWithDocument = True
                except Exception:
                    pass
                try:
                    with_retry(lf.BreakLink)
                except Exception:
                    pass
    except Exception:
        pass

# ---------- Import AI HTML ----------
def import_ai_html_to_docx(ai_html_path: str, out_docx_path: str):
    pythoncom.CoInitialize()
    word = None
    doc_out = None
    html_doc = None
    old_save_normal_prompt = None
    old_confirm_conversions = None
    try:
        word = win32.Dispatch("Word.Application")
        word.Visible = False
        word.DisplayAlerts = 0
        try:
            old_save_normal_prompt = word.Options.SaveNormalPrompt
            word.Options.SaveNormalPrompt = False
        except Exception:
            pass
        try:
            old_confirm_conversions = word.Options.ConfirmConversions
            word.Options.ConfirmConversions = False
        except Exception:
            pass
        html_doc = with_retry(
            word.Documents.Open,
            FileName=norm_path(ai_html_path),
            ConfirmConversions=False,
            ReadOnly=True,
            AddToRecentFiles=False
        )
        template_path = SEED_TEMPLATE_PATH if (SEED_TEMPLATE_PATH and os.path.isfile(SEED_TEMPLATE_PATH)) else word.NormalTemplate.FullName
        print(f"Using Word template: {template_path}")
        doc_out = with_retry(word.Documents.Add, Template=template_path)
        try:
            win = None
            try:
                win = doc_out.ActiveWindow
            except Exception:
                pass
            if not win:
                try:
                    win = doc_out.Windows(1)
                except Exception:
                    win = None
            if win:
                win.View.Type = WD_VIEW_PRINT
        except Exception:
            pass
        set_high_quality(word, doc_out)
        time.sleep(0.2)
        dst = with_retry(doc_out.Range, Start=0, End=0)
        dst.FormattedText = html_doc.Content.FormattedText
        flatten_image_only_tables(doc_out)
        enforce_lists(doc_out)
        apply_bulleted_list_style(doc_out)
        ensure_numbered_list_paragraphs(doc_out)
        ensure_normal_paragraphs(doc_out)
        embed_images_and_break_links(doc_out)
        out_norm = norm_path(out_docx_path)
        out_dir = os.path.dirname(out_norm)
        if out_dir and not os.path.isdir(out_dir):
            os.makedirs(out_dir, exist_ok=True)
        try:
            with_retry(doc_out.SaveAs2, FileName=out_norm, FileFormat=WD_FORMAT_XML_DOCUMENT)
        except AttributeError:
            with_retry(doc_out.SaveAs, FileName=out_norm, FileFormat=WD_FORMAT_XML_DOCUMENT)
        try:
            doc_out.Saved = True
            doc_out.Close(SaveChanges=False)
        except Exception:
            pass
        return out_norm
    finally:
        try:
            if html_doc is not None:
                html_doc.Close(SaveChanges=False)
        except Exception:
            pass
        try:
            if word is not None:
                try:
                    if old_save_normal_prompt is not None:
                        word.Options.SaveNormalPrompt = old_save_normal_prompt
                except Exception:
                    pass
                try:
                    if old_confirm_conversions is not None:
                        word.Options.ConfirmConversions = old_confirm_conversions
                except Exception:
                    pass
                word.Quit()
        except Exception:
            pass
        try:
            pythoncom.CoUninitialize()
        except Exception:
            pass

# ---------- Browser automation ----------
class NavigatorChat:
    def __init__(self, user_data_dir: str):
        self.user_data_dir = user_data_dir
        self.play = None
        self.context = None
        self.page = None

    def start(self):
        self.play = sync_playwright().start()
        self.context = self.play.chromium.launch_persistent_context(
            user_data_dir=self.user_data_dir,
            headless=False,
            args=["--disable-features=IsolateOrigins,site-per-process"]
        )
        self.page = self.context.new_page()
        self.page.goto(NAVIGATOR_CHAT_URL, wait_until="load")
        try:
            self.page.wait_for_load_state("networkidle", timeout=10000)
        except Exception:
            pass

    def stop(self):
        try:
            if self.context:
                self.context.close()
        except Exception:
            pass
        try:
            if self.play:
                self.play.stop()
        except Exception:
            pass

    def _find_composer(self):
        page = self.page
        frame = page
        for f in page.frames[::-1]:
            try:
                if "chat.ai.it.ufl.edu" in (f.url or ""):
                    frame = f
                    break
            except Exception:
                pass
        selectors = [
            'textarea',
            '[contenteditable="true"]',
            '[role="textbox"]',
            'div[aria-label*="Message"]',
            'div[aria-label*="Type"]',
        ]
        input_el = None
        matched_selector = None
        for sel in selectors:
            loc = frame.locator(sel)
            if loc.count() > 0:
                input_el = loc.first
                matched_selector = sel
                try:
                    input_el.wait_for(state="visible", timeout=5000)
                except Exception:
                    pass
                break
        if input_el is None:
            try:
                frame.locator("body").first.click(timeout=3000)
                for _ in range(6):
                    page.keyboard.press("Tab")
                    time.sleep(0.1)
                for sel in selectors:
                    loc = frame.locator(sel)
                    if loc.count() > 0:
                        input_el = loc.first
                        matched_selector = sel
                        break
            except Exception:
                pass
        return frame, input_el, matched_selector

    def _strip_code_fences_and_unescape(self, txt: str) -> str:
        if not txt:
            return txt
        t = txt.strip()
        if t.startswith("```"):
            nl = t.find("\n")
            if nl != -1:
                t = t[nl+1:]
            else:
                t = t[3:]
            t = t.strip()
            if t.endswith("```"):
                t = t[:-3].strip()
        if any(e in t for e in ("&lt;", "&gt;", "&amp;")):
            t = html.unescape(t)
        return t

    def submit_and_get_html(self, content: str, wait_seconds: int = 600, stable_checks: int = 3) -> str:
        if not content or not content.strip():
            raise ValueError("Prompt + body HTML is empty. Check the export and packaging steps.")
        page = self.page
        page.bring_to_front()
        try:
            page.wait_for_load_state("domcontentloaded")
        except Exception:
            pass
        try:
            page.wait_for_load_state("networkidle", timeout=10000)
        except Exception:
            pass
        frame, input_el, matched = self._find_composer()
        if input_el is None:
            page.screenshot(path=f"navigator_no_input_{datetime.datetime.now().strftime('%H%M%S')}.png")
            raise RuntimeError("Could not find the chat input box. Adjust selectors to your Navigator Chat DOM.")
        print(f"Chat input matched selector: {matched}")
        try:
            input_el.click(timeout=5000)
        except Exception:
            pass
        try:
            page.keyboard.press("Control+A")
            page.keyboard.press("Delete")
        except Exception:
            pass
        inserted = False
        try:
            tag = input_el.evaluate("el => el.tagName")
            if str(tag).upper() in ("TEXTAREA", "INPUT"):
                input_el.fill(content)
                inserted = True
                print("Used element.fill to insert content.")
        except Exception:
            pass
        if not inserted:
            try:
                page.evaluate("text => navigator.clipboard && navigator.clipboard.writeText(text)", content)
                time.sleep(0.2)
                page.keyboard.press("Control+V")
                inserted = True
                print("Used clipboard paste (Ctrl+V) to insert content.")
            except Exception:
                pass
        if not inserted:
            page.keyboard.type(content, delay=0)
            print("Used page.keyboard.type to insert content.")
        time.sleep(0.3)
        sent = False
        try:
            frame.get_by_role("button", name=re.compile(r"(send|submit|enter|send message)", re.I)).first.click(timeout=2000)
            sent = True
            print("Clicked Send/Submit button.")
        except Exception:
            pass
        if not sent:
            try:
                page.keyboard.press("Enter")
                sent = True
                print("Pressed Enter to submit.")
            except Exception:
                pass
        if not sent:
            try:
                page.keyboard.press("Control+Enter")
                sent = True
                print("Pressed Ctrl+Enter to submit.")
            except Exception:
                pass
        if not sent:
            raise RuntimeError("Could not submit the message.")

        def extract_candidate() -> str:
            for sel in ("pre code", "pre", "code"):
                loc = frame.locator(sel)
                n = loc.count()
                for i in range(n - 1, max(-1, n - 6), -1):
                    try:
                        txt = loc.nth(i).inner_text()
                    except Exception:
                        continue
                    if not txt or "<html" not in txt.lower():
                        continue
                    t = self._strip_code_fences_and_unescape(txt)
                    low = t.lower()
                    s = low.find("<html")
                    e = low.rfind("</html>")
                    if s != -1 and e != -1:
                        return t[s:e+7]
            try:
                body_text = frame.inner_text("body")
            except Exception:
                body_text = ""
            t = body_text
            low = t.lower()
            s = low.find("<html")
            e = low.rfind("</html>")
            if s != -1 and e != -1:
                return t[s:e+7]
            return ""

        def looks_complete(doc: str) -> bool:
            if not doc:
                return False
            low = doc.lower()
            return ("<html" in low and "</html" in low and "<head" in low and "<body" in low)

        deadline = time.time() + wait_seconds
        last = ""
        stable = 0
        best = ""
        while time.time() < deadline:
            cand = extract_candidate()
            if cand:
                best = cand if len(cand) >= len(best) else best
                if cand == last:
                    stable += 1
                else:
                    stable = 1
                    last = cand
                if looks_complete(cand) and stable >= stable_checks:
                    return cand
            time.sleep(1.0)
        if looks_complete(best) and len(best) > 200:
            return best
        page.screenshot(path=f"navigator_timeout_{datetime.datetime.now().strftime('%H%M%S')}.png")
        raise TimeoutError("AI response with complete HTML not detected within the timeout window.")

# ---------- Batch processing ----------
def process_one_docx(docx_path: str, user_data_dir: str):
    html_path, assets_dir, short_base = export_doc_to_filtered_html(docx_path)
    work_dir = make_work_dir(docx_path, short_base)
    copy_all(assets_dir, work_dir)
    with open(html_path, "r", encoding="utf-8", errors="ignore") as f:
        full_html = f.read()
    body_only = extract_relevant_html_for_ai(full_html)
    prompt_plus_body = package_for_ai(body_only, assets_dir, work_dir)
    chat = NavigatorChat(user_data_dir=user_data_dir)
    chat.start()
    try:
        ai_html_raw = chat.submit_and_get_html(prompt_plus_body, wait_seconds=600, stable_checks=3)
    finally:
        chat.stop()
    ai_html_clean = strip_leaked_prompt_from_html(ai_html_raw)
    ai_html_clean = rebase_img_src_to_existing(ai_html_clean, work_dir, assets_dir)
    ai_html_processed = preprocess_html_for_word(ai_html_clean)
    ai_html_path = os.path.join(work_dir, "ai_output.html")
    with open(ai_html_path, "w", encoding="utf-8") as f:
        f.write(ai_html_processed)
    orig_dir = os.path.dirname(docx_path)
    orig_base = os.path.basename(docx_path)
    base_no_ext, ext = os.path.splitext(orig_base)
    pre_folder = os.path.join(orig_dir, "Pre ADA Update Docx Files")
    os.makedirs(pre_folder, exist_ok=True)
    pre_name = f"PreADA_{orig_base}"
    pre_path = os.path.join(pre_folder, pre_name)
    if os.path.exists(pre_path):
        pre_name = f"PreADA_{base_no_ext}_{timestamp()}{ext}"
        pre_path = os.path.join(pre_folder, pre_name)
    shutil.move(docx_path, pre_path)
    new_name = orig_base if ext.lower() == ".docx" else f"{base_no_ext}.docx"
    out_path = os.path.join(orig_dir, new_name)
    saved = import_ai_html_to_docx(ai_html_path, out_path)
    return saved, pre_path

def find_docx_files(root_folder: str):
    for dirpath, _, filenames in os.walk(root_folder):
        for fn in filenames:
            if fn.lower().endswith((".docx", ".doc")):
                yield os.path.join(dirpath, fn)

# ---------- GUI Application ----------
class App:
    def __init__(self, root):
        self.root = root
        self.root.title("T_ODDocumentUpdater")
        self.paths = []
        self.user_data_dir = os.path.join(os.path.expanduser("~"), "NavigatorAutomationProfile")
        os.makedirs(self.user_data_dir, exist_ok=True)

        frm = ttk.Frame(root, padding=10)
        frm.pack(fill="both", expand=True)

        top_row = ttk.Frame(frm)
        top_row.pack(fill="x", pady=(0, 8))
        ttk.Label(top_row, text="Drop Word files or folders below, or use the buttons:").pack(side="left")

        drop_label_text = "Drop files/folders here"
        self.drop = tk.Label(frm, text=drop_label_text, relief="groove", height=4)
        self.drop.pack(fill="both", expand=True)
        if TKDND_AVAILABLE:
            self.drop.drop_target_register(DND_FILES)
            self.drop.dnd_bind("<<Drop>>", self.on_drop)
        else:
            self.drop.config(text=f"{drop_label_text}\n(Drag-and-drop helper not available; use the buttons)")

        btn_row = ttk.Frame(frm)
        btn_row.pack(fill="x", pady=8)
        ttk.Button(btn_row, text="Add Files…", command=self.add_files).pack(side="left", padx=4)
        ttk.Button(btn_row, text="Select Folder…", command=self.add_folder).pack(side="left", padx=4)
        ttk.Button(btn_row, text="Clear", command=self.clear_list).pack(side="left", padx=4)
        self.start_btn = ttk.Button(btn_row, text="Start", command=self.start_processing)
        self.start_btn.pack(side="right")

        ttk.Label(frm, text="Queue:").pack(anchor="w")
        self.listbox = tk.Listbox(frm, height=8, selectmode="extended")
        self.listbox.pack(fill="both", expand=True)

        ttk.Label(frm, text="Log:").pack(anchor="w", pady=(8, 0))
        self.log = tk.Text(frm, height=10, wrap="word", state="disabled")
        self.log.pack(fill="both", expand=True)

        self.status = ttk.Label(frm, text="Ready.")
        self.status.pack(anchor="w", pady=(6, 0))

        frm.columnconfigure(0, weight=1)
        root.minsize(600, 500)

    def append_log(self, msg):
        print(msg)
        self.log.config(state="normal")
        self.log.insert("end", msg + "\n")
        self.log.see("end")
        self.log.config(state="disabled")

    def on_drop(self, event):
        try:
            items = self.root.tk.splitlist(event.data)
        except Exception:
            items = [event.data]
        self.add_paths(items)

    def add_files(self):
        paths = filedialog.askopenfilenames(title="Select Word files", filetypes=[("Word", "*.docx *.doc")])
        if paths:
            self.add_paths(paths)

    def add_folder(self):
        folder = filedialog.askdirectory(title="Select folder containing Word files")
        if folder:
            self.add_paths([folder])

    def add_paths(self, paths):
        added = 0
        for p in paths:
            p = p.strip().strip('"')
            if not p:
                continue
            if p not in self.paths:
                self.paths.append(p)
                self.listbox.insert("end", p)
                added += 1
        if added:
            self.status.config(text=f"Added {added} item(s).")

    def clear_list(self):
        self.paths.clear()
        self.listbox.delete(0, "end")
        self.status.config(text="Cleared queue.")

    def disable_ui(self, working=True):
        state = "disabled" if working else "normal"
        self.start_btn.config(state=state)

    def show_signin_instructions(self):
        messagebox.showinfo(
            "What happens next",
            "In a moment, a browser window will open to Navigator Chat. This is expected.\n\n"
            "While the browser is open, please complete a short one-time setup:\n"
            "  • Sign in with your UF credentials if prompted.\n"
            "  • In the top-left of the Navigator Chat window, open the model dropdown and select “gpt-5”.\n"
            "  • Click “Set as default” right below the dropdown.\n\n"
            "The app will wait for you to do these steps. Nothing else will happen until you finish them.\n"
            "After you’ve done them in the browser, return to the app and click OK in the next prompt to begin processing."
        )

    def start_processing(self):
        if not self.paths:
            messagebox.showwarning("Nothing to do", "Please add Word files or a folder first.")
            return
        # Show instructions BEFORE the browser opens
        self.show_signin_instructions()
        t = threading.Thread(target=self._worker, daemon=True)
        t.start()

    def _worker(self):
        try:
            self.disable_ui(True)
            self.append_log("Starting…")
            # Open Navigator so user can sign in and confirm readiness
            ensure_profile_signed_in_gui(self.user_data_dir, self.append_log)

            # Build a flat list of files
            file_list = []
            for p in self.paths:
                if os.path.isdir(p):
                    file_list.extend(list(find_docx_files(p)))
                elif os.path.isfile(p) and p.lower().endswith((".docx", ".doc")):
                    file_list.append(p)
            if not file_list:
                self.append_log("No .docx/.doc files found.")
                self.status.config(text="No files found.")
                return

            successes = 0
            skipped = []
            for i, f in enumerate(file_list, 1):
                self.status.config(text=f"Processing {i}/{len(file_list)}: {f}")
                self.append_log(f"\nProcessing: {f}")
                try:
                    saved, pre_path = process_one_docx(f, self.user_data_dir)
                    self.append_log(f"Saved: {saved}")
                    successes += 1
                except Exception as e:
                    self.append_log(f"Skipped: {f}\n  Reason: {e}")
                    skipped.append(f"{f} :: {e}\n{traceback.format_exc()}")

            self.append_log("\nBatch complete.")
            self.append_log(f"Processed successfully: {successes}")
            if skipped:
                base_dir = os.path.dirname(self.paths[0]) if os.path.isfile(self.paths[0]) else self.paths[0]
                report_path = os.path.join(base_dir, f"ADAUpdate_skipped_{timestamp()}.txt")
                try:
                    with open(report_path, "w", encoding="utf-8") as f:
                        f.write("\n\n".join(skipped))
                    self.append_log(f"Skipped {len(skipped)} files. See report:\n{report_path}")
                except Exception:
                    self.append_log(f"Skipped {len(skipped)} files. Could not write report.")
            self.status.config(text="Done.")
        finally:
            self.disable_ui(False)

# ---------- Entry point ----------
def main():
    if TKDND_AVAILABLE:
        root = TkinterDnD.Tk()
    else:
        root = tk.Tk()
    app = App(root)
    root.mainloop()

if __name__ == "__main__":
    main()