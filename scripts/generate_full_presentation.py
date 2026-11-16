import os
import sys
import struct
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

# ==============================================================================
# COLOR PALETTE DEFINITIONS (Brand: Olive Green & Deep Navy)
# ==============================================================================
COLOR_NAVY_DARK = RGBColor(15, 23, 42)       # #0F172A - Main dark background / titles
COLOR_NAVY_LIGHT = RGBColor(30, 41, 59)      # #1E293B - Secondary dark
COLOR_OLIVE_DARK = RGBColor(45, 90, 39)      # #2D5A27 - Primary brand accent
COLOR_OLIVE_LIGHT = RGBColor(61, 122, 53)    # #3D7A35 - Vibrant brand accent
COLOR_OLIVE_PILL = RGBColor(235, 245, 233)   # #EBF5E9 - Light olive badge background
COLOR_SLATE_BG = RGBColor(248, 250, 252)     # #F8FAFC - Main slide background
COLOR_CARD_BG = RGBColor(255, 255, 255)      # #FFFFFF - White card background
COLOR_BORDER = RGBColor(226, 232, 240)       # #E2E8F0 - Subtle card border
COLOR_TEXT_MAIN = RGBColor(15, 23, 42)       # #0F172A - Primary body/heading text
COLOR_TEXT_MUTED = RGBColor(71, 85, 105)     # #475569 - Secondary body text
COLOR_TEXT_WHITE = RGBColor(255, 255, 255)   # #FFFFFF - Text on dark backgrounds
COLOR_AMBER = RGBColor(217, 119, 6)          # #D97706 - Warning / attention accent
COLOR_BLUE = RGBColor(37, 99, 235)           # #2563EB - Informational blue

SCREENSHOTS_DIR = "D:\\LandInvest_Presentation\\screenshots"
OUTPUT_PPTX = "D:\\LandInvest_Presentation\\LandInvest_Client_Presentation.pptx"

TOTAL_SLIDES = 64

# ==============================================================================
# INITIALIZE PRESENTATION
# ==============================================================================
prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)
blank_layout = prs.slide_layouts[6]

current_slide_num = 0

def add_footer(slide, current_num, is_dark=False):
    # Left company text
    txBox = slide.shapes.add_textbox(Inches(0.8), Inches(7.05), Inches(8.0), Inches(0.3))
    tf = txBox.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "LandInvest ERP — Real Estate Syndicate & Partnership Accounting | Confidential"
    p.font.name = "Arial"
    p.font.size = Pt(9)
    p.font.color.rgb = RGBColor(148, 163, 184) if is_dark else COLOR_TEXT_MUTED

    # Right slide number
    txBox2 = slide.shapes.add_textbox(Inches(10.5), Inches(7.05), Inches(2.0), Inches(0.3))
    tf2 = txBox2.text_frame
    p2 = tf2.paragraphs[0]
    p2.text = f"Slide {current_num} of {TOTAL_SLIDES}"
    p2.alignment = PP_ALIGN.RIGHT
    p2.font.name = "Arial"
    p2.font.size = Pt(9)
    p2.font.color.rgb = RGBColor(148, 163, 184) if is_dark else COLOR_TEXT_MUTED

def set_speaker_notes(slide, notes_text):
    notes_slide = slide.notes_slide
    text_frame = notes_slide.notes_text_frame
    text_frame.text = notes_text

# ------------------------------------------------------------------------------
# 1. TITLE SLIDE
# ------------------------------------------------------------------------------
def create_title_slide(title, subtitle, client_name, presenter_name, date_str, notes):
    global current_slide_num
    current_slide_num += 1
    slide = prs.slides.add_slide(blank_layout)

    # Dark background
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = COLOR_NAVY_DARK
    bg.line.fill.background()

    # Brand badge
    pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.2), Inches(3.2), Inches(0.4))
    pill.fill.solid()
    pill.fill.fore_color.rgb = COLOR_OLIVE_DARK
    pill.line.fill.background()
    p = pill.text_frame.paragraphs[0]
    p.text = "LANDINVEST ERP SUITE"
    p.font.bold = True
    p.font.size = Pt(11)
    p.font.color.rgb = COLOR_TEXT_WHITE
    p.alignment = PP_ALIGN.CENTER

    # Title
    t_box = slide.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(11.3), Inches(2.0))
    tf = t_box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = title
    p.font.name = "Arial"
    p.font.size = Pt(36)
    p.font.bold = True
    p.font.color.rgb = COLOR_TEXT_WHITE

    # Subtitle
    s_box = slide.shapes.add_textbox(Inches(1.0), Inches(3.8), Inches(11.0), Inches(1.2))
    tf_s = s_box.text_frame
    tf_s.word_wrap = True
    p_s = tf_s.paragraphs[0]
    p_s.text = subtitle
    p_s.font.name = "Arial"
    p_s.font.size = Pt(18)
    p_s.font.color.rgb = RGBColor(203, 213, 225)

    # Metadata Card
    card = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.0), Inches(5.2), Inches(11.3), Inches(1.4))
    card.fill.solid()
    card.fill.fore_color.rgb = RGBColor(30, 41, 59)
    card.line.color.rgb = RGBColor(51, 65, 85)
    
    tf_c = card.text_frame
    tf_c.word_wrap = True
    p_c1 = tf_c.paragraphs[0]
    p_c1.text = f"Prepared Exclusively For: {client_name}"
    p_c1.font.name = "Arial"
    p_c1.font.size = Pt(16)
    p_c1.font.bold = True
    p_c1.font.color.rgb = RGBColor(163, 230, 53) # Light green accent

    p_c2 = tf_c.add_paragraph()
    p_c2.text = f"Presented By: {presenter_name}   |   Date: {date_str}   |   Version: Enterprise Edition"
    p_c2.font.name = "Arial"
    p_c2.font.size = Pt(13)
    p_c2.font.color.rgb = RGBColor(226, 232, 240)

    add_footer(slide, current_slide_num, is_dark=True)
    set_speaker_notes(slide, notes)
    return slide

# ------------------------------------------------------------------------------
# 2. SECTION DIVIDER SLIDE
# ------------------------------------------------------------------------------
def create_section_divider(part_label, section_title, summary_points, notes):
    global current_slide_num
    current_slide_num += 1
    slide = prs.slides.add_slide(blank_layout)

    # Dark background
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = COLOR_NAVY_DARK
    bg.line.fill.background()

    # Decorative olive accent bar on left
    bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.5), Inches(0.2), Inches(4.5))
    bar.fill.solid()
    bar.fill.fore_color.rgb = COLOR_OLIVE_LIGHT
    bar.line.fill.background()

    # Part label
    pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.3), Inches(1.5), Inches(2.2), Inches(0.35))
    pill.fill.solid()
    pill.fill.fore_color.rgb = COLOR_OLIVE_DARK
    pill.line.fill.background()
    p = pill.text_frame.paragraphs[0]
    p.text = part_label
    p.font.bold = True
    p.font.size = Pt(11)
    p.font.color.rgb = COLOR_TEXT_WHITE
    p.alignment = PP_ALIGN.CENTER

    # Title
    t_box = slide.shapes.add_textbox(Inches(1.3), Inches(2.0), Inches(11.0), Inches(1.5))
    tf = t_box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = section_title
    p.font.name = "Arial"
    p.font.size = Pt(32)
    p.font.bold = True
    p.font.color.rgb = COLOR_TEXT_WHITE

    # Key takeaways card
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.3), Inches(3.6), Inches(11.0), Inches(2.6))
    card.fill.solid()
    card.fill.fore_color.rgb = RGBColor(30, 41, 59)
    card.line.color.rgb = RGBColor(51, 65, 85)

    tf_c = card.text_frame
    tf_c.word_wrap = True
    p0 = tf_c.paragraphs[0]
    p0.text = "In this section, you will see:"
    p0.font.bold = True
    p0.font.size = Pt(14)
    p0.font.color.rgb = RGBColor(163, 230, 53)

    for pt in summary_points:
        p_pt = tf_c.add_paragraph()
        p_pt.text = f"•  {pt}"
        p_pt.font.size = Pt(13)
        p_pt.font.color.rgb = RGBColor(226, 232, 240)
        p_pt.space_before = Pt(6)

    add_footer(slide, current_slide_num, is_dark=True)
    set_speaker_notes(slide, notes)
    return slide

def get_png_dimensions(image_path):
    if not os.path.exists(image_path):
        return 2880, 1800
    try:
        with open(image_path, "rb") as f:
            data = f.read(24)
            if data.startswith(b"\x89PNG\r\n\x1a\n"):
                return struct.unpack(">II", data[16:24])
    except Exception:
        pass
    return 2880, 1800

# ------------------------------------------------------------------------------
# 3. SCREENSHOT SLIDE WITH CALLOUT LEGEND
# ------------------------------------------------------------------------------
def create_screenshot_slide(module_tag, title, subtitle, image_filename, callouts, notes):
    global current_slide_num
    current_slide_num += 1
    slide = prs.slides.add_slide(blank_layout)

    # Light background
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = COLOR_SLATE_BG
    bg.line.fill.background()

    # Module tag pill
    pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.35), Inches(2.6), Inches(0.3))
    pill.fill.solid()
    pill.fill.fore_color.rgb = COLOR_OLIVE_DARK
    pill.line.fill.background()
    p = pill.text_frame.paragraphs[0]
    p.text = module_tag.upper()
    p.font.bold = True
    p.font.size = Pt(10)
    p.font.color.rgb = COLOR_TEXT_WHITE
    p.alignment = PP_ALIGN.CENTER

    # Slide Title
    t_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.70), Inches(11.7), Inches(0.45))
    tf = t_box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = title
    p.font.name = "Arial"
    p.font.size = Pt(21)
    p.font.bold = True
    p.font.color.rgb = COLOR_TEXT_MAIN

    # Subtitle
    s_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.12), Inches(11.7), Inches(0.30))
    tf_s = s_box.text_frame
    tf_s.word_wrap = True
    p_s = tf_s.paragraphs[0]
    p_s.text = subtitle
    p_s.font.name = "Arial"
    p_s.font.size = Pt(12)
    p_s.font.color.rgb = COLOR_TEXT_MUTED

    # Determine image dimensions & aspect ratio
    image_path = os.path.join(SCREENSHOTS_DIR, image_filename)
    if os.path.exists(image_path):
        img_w, img_h = get_png_dimensions(image_path)
        aspect = img_w / img_h

        # Stage bounds for screenshot in 2-column layout
        col_max_w = 8.90
        col_max_h = 5.50

        if (col_max_w / col_max_h) > aspect:
            disp_h = col_max_h
            disp_w = col_max_h * aspect
        else:
            disp_w = col_max_w
            disp_h = col_max_w / aspect

        disp_left = 0.75 + (col_max_w - disp_w) / 2
        disp_top = 1.45 + (col_max_h - disp_h) / 2

        # Card container behind screenshot
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(disp_left - 0.04), Inches(disp_top - 0.04), Inches(disp_w + 0.08), Inches(disp_h + 0.08))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD_BG
        card.line.color.rgb = COLOR_BORDER
        card.line.width = Pt(1)

        # Insert screenshot with exact aspect ratio preserved (zero distortion!)
        slide.shapes.add_picture(image_path, Inches(disp_left), Inches(disp_top), Inches(disp_w), Inches(disp_h))
    else:
        # Fallback placeholder box
        ph = slide.shapes.add_textbox(Inches(1.0), Inches(2.5), Inches(8.0), Inches(2.0))
        ph.text_frame.paragraphs[0].text = f"[Screenshot image not found: {image_filename}]"

    # Legend Card (Right column: 2.70" wide, 5.50" high)
    legend_bg = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.85), Inches(1.45), Inches(2.70), Inches(5.50))
    legend_bg.fill.solid()
    legend_bg.fill.fore_color.rgb = COLOR_CARD_BG
    legend_bg.line.color.rgb = COLOR_BORDER
    legend_bg.line.width = Pt(1)

    tf_l = legend_bg.text_frame
    tf_l.word_wrap = True
    p_lh = tf_l.paragraphs[0]
    p_lh.text = "KEY SYSTEM HIGHLIGHTS"
    p_lh.font.bold = True
    p_lh.font.size = Pt(11)
    p_lh.font.color.rgb = COLOR_OLIVE_DARK

    for idx, (headline, body) in enumerate(callouts, start=1):
        p_num = tf_l.add_paragraph()
        p_num.text = f"{idx}. {headline}"
        p_num.font.bold = True
        p_num.font.size = Pt(11.5)
        p_num.font.color.rgb = COLOR_TEXT_MAIN
        p_num.space_before = Pt(12)

        p_desc = tf_l.add_paragraph()
        p_desc.text = body
        p_desc.font.size = Pt(10)
        p_desc.font.color.rgb = COLOR_TEXT_MUTED
        p_desc.space_before = Pt(2)

    add_footer(slide, current_slide_num)
    set_speaker_notes(slide, notes)
    return slide

# ------------------------------------------------------------------------------
# 4. CONTENT / FEATURE HIGHLIGHT SLIDE
# ------------------------------------------------------------------------------
def create_content_slide(module_tag, title, subtitle, bullets_left, card_right_title, card_right_body, notes):
    global current_slide_num
    current_slide_num += 1
    slide = prs.slides.add_slide(blank_layout)

    # Light background
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = COLOR_SLATE_BG
    bg.line.fill.background()

    # Module tag pill
    pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.35), Inches(2.6), Inches(0.3))
    pill.fill.solid()
    pill.fill.fore_color.rgb = COLOR_OLIVE_DARK
    pill.line.fill.background()
    p = pill.text_frame.paragraphs[0]
    p.text = module_tag.upper()
    p.font.bold = True
    p.font.size = Pt(10)
    p.font.color.rgb = COLOR_TEXT_WHITE
    p.alignment = PP_ALIGN.CENTER

    # Title
    t_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.5))
    tf = t_box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = title
    p.font.name = "Arial"
    p.font.size = Pt(24)
    p.font.bold = True
    p.font.color.rgb = COLOR_TEXT_MAIN

    # Subtitle
    s_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.15), Inches(11.7), Inches(0.35))
    tf_s = s_box.text_frame
    tf_s.word_wrap = True
    p_s = tf_s.paragraphs[0]
    p_s.text = subtitle
    p_s.font.name = "Arial"
    p_s.font.size = Pt(13)
    p_s.font.color.rgb = COLOR_TEXT_MUTED

    # Left Column (Card with bullets: 6.8" wide)
    card_l = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.6), Inches(6.8), Inches(5.2))
    card_l.fill.solid()
    card_l.fill.fore_color.rgb = COLOR_CARD_BG
    card_l.line.color.rgb = COLOR_BORDER
    card_l.line.width = Pt(1)

    tf_l = card_l.text_frame
    tf_l.word_wrap = True
    p_head = tf_l.paragraphs[0]
    p_head.text = "Operational Capabilities & Business Rules"
    p_head.font.bold = True
    p_head.font.size = Pt(14)
    p_head.font.color.rgb = COLOR_OLIVE_DARK

    for title_b, desc_b in bullets_left:
        p_t = tf_l.add_paragraph()
        p_t.text = f"✔  {title_b}"
        p_t.font.bold = True
        p_t.font.size = Pt(12)
        p_t.font.color.rgb = COLOR_TEXT_MAIN
        p_t.space_before = Pt(8)

        p_d = tf_l.add_paragraph()
        p_d.text = f"    {desc_b}"
        p_d.font.size = Pt(11)
        p_d.font.color.rgb = COLOR_TEXT_MUTED
        p_d.space_before = Pt(2)

    # Right Column (Deep Dive / Strategic Takeaway Card: 4.6" wide)
    card_r = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.9), Inches(1.6), Inches(4.6), Inches(5.2))
    card_r.fill.solid()
    card_r.fill.fore_color.rgb = COLOR_NAVY_DARK
    card_r.line.fill.background()

    tf_r = card_r.text_frame
    tf_r.word_wrap = True
    p_rh = tf_r.paragraphs[0]
    p_rh.text = card_right_title
    p_rh.font.bold = True
    p_rh.font.size = Pt(16)
    p_rh.font.color.rgb = RGBColor(163, 230, 53)

    for item in card_right_body:
        p_item = tf_r.add_paragraph()
        p_item.text = item
        p_item.font.size = Pt(12)
        p_item.font.color.rgb = RGBColor(226, 232, 240)
        p_item.space_before = Pt(10)

    add_footer(slide, current_slide_num)
    set_speaker_notes(slide, notes)
    return slide

# ------------------------------------------------------------------------------
# 5. WORKFLOW / PROCESS SLIDE
# ------------------------------------------------------------------------------
def create_workflow_slide(module_tag, title, subtitle, steps, notes):
    global current_slide_num
    current_slide_num += 1
    slide = prs.slides.add_slide(blank_layout)

    # Light background
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = COLOR_SLATE_BG
    bg.line.fill.background()

    # Module tag pill
    pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.35), Inches(2.6), Inches(0.3))
    pill.fill.solid()
    pill.fill.fore_color.rgb = COLOR_OLIVE_DARK
    pill.line.fill.background()
    p = pill.text_frame.paragraphs[0]
    p.text = module_tag.upper()
    p.font.bold = True
    p.font.size = Pt(10)
    p.font.color.rgb = COLOR_TEXT_WHITE
    p.alignment = PP_ALIGN.CENTER

    # Title & Subtitle
    t_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.5))
    tf = t_box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = title
    p.font.name = "Arial"
    p.font.size = Pt(24)
    p.font.bold = True
    p.font.color.rgb = COLOR_TEXT_MAIN

    s_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.15), Inches(11.7), Inches(0.35))
    tf_s = s_box.text_frame
    tf_s.word_wrap = True
    p_s = tf_s.paragraphs[0]
    p_s.text = subtitle
    p_s.font.name = "Arial"
    p_s.font.size = Pt(13)
    p_s.font.color.rgb = COLOR_TEXT_MUTED

    # Render 4 or 5 Step Cards horizontally
    n_steps = len(steps)
    step_width = (11.7 - (n_steps - 1) * 0.25) / n_steps

    for idx, (step_num, step_name, step_actor, step_action, step_outcome) in enumerate(steps):
        left_pos = Inches(0.8 + idx * (step_width + 0.25))
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left_pos, Inches(1.7), Inches(step_width), Inches(5.1))
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD_BG
        card.line.color.rgb = COLOR_BORDER
        card.line.width = Pt(1.5)

        tf_c = card.text_frame
        tf_c.word_wrap = True
        
        # Step Number Badge
        p0 = tf_c.paragraphs[0]
        p0.text = f"STEP {step_num}"
        p0.font.bold = True
        p0.font.size = Pt(12)
        p0.font.color.rgb = COLOR_OLIVE_DARK

        p1 = tf_c.add_paragraph()
        p1.text = step_name
        p1.font.bold = True
        p1.font.size = Pt(13)
        p1.font.color.rgb = COLOR_TEXT_MAIN
        p1.space_before = Pt(6)

        p2 = tf_c.add_paragraph()
        p2.text = f"👤 Who: {step_actor}"
        p2.font.bold = True
        p2.font.size = Pt(10.5)
        p2.font.color.rgb = COLOR_BLUE
        p2.space_before = Pt(8)

        p3 = tf_c.add_paragraph()
        p3.text = f"⚙ Action: {step_action}"
        p3.font.size = Pt(10)
        p3.font.color.rgb = COLOR_TEXT_MUTED
        p3.space_before = Pt(6)

        p4 = tf_c.add_paragraph()
        p4.text = f"✔ System Result: {step_outcome}"
        p4.font.size = Pt(10)
        p4.font.color.rgb = COLOR_OLIVE_DARK
        p4.space_before = Pt(6)

    add_footer(slide, current_slide_num)
    set_speaker_notes(slide, notes)
    return slide

# ------------------------------------------------------------------------------
# 6. TABLE SLIDE (For RBAC, Comparison, Pricing, etc.)
# ------------------------------------------------------------------------------
def create_table_slide(module_tag, title, subtitle, headers, rows, notes):
    global current_slide_num
    current_slide_num += 1
    slide = prs.slides.add_slide(blank_layout)

    # Light background
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = COLOR_SLATE_BG
    bg.line.fill.background()

    # Module tag pill
    pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.35), Inches(2.6), Inches(0.3))
    pill.fill.solid()
    pill.fill.fore_color.rgb = COLOR_OLIVE_DARK
    pill.line.fill.background()
    p = pill.text_frame.paragraphs[0]
    p.text = module_tag.upper()
    p.font.bold = True
    p.font.size = Pt(10)
    p.font.color.rgb = COLOR_TEXT_WHITE
    p.alignment = PP_ALIGN.CENTER

    # Title & Subtitle
    t_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.5))
    tf = t_box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = title
    p.font.name = "Arial"
    p.font.size = Pt(24)
    p.font.bold = True
    p.font.color.rgb = COLOR_TEXT_MAIN

    s_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.15), Inches(11.7), Inches(0.35))
    tf_s = s_box.text_frame
    tf_s.word_wrap = True
    p_s = tf_s.paragraphs[0]
    p_s.text = subtitle
    p_s.font.name = "Arial"
    p_s.font.size = Pt(13)
    p_s.font.color.rgb = COLOR_TEXT_MUTED

    # Table Shape
    num_rows = len(rows) + 1
    num_cols = len(headers)
    table_shape = slide.shapes.add_table(num_rows, num_cols, Inches(0.8), Inches(1.6), Inches(11.7), Inches(5.1))
    table = table_shape.table

    # Format Header Row
    for col_idx, h_text in enumerate(headers):
        cell = table.cell(0, col_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = COLOR_NAVY_DARK
        p = cell.text_frame.paragraphs[0]
        p.text = h_text
        p.font.bold = True
        p.font.size = Pt(11.5)
        p.font.color.rgb = COLOR_TEXT_WHITE
        p.alignment = PP_ALIGN.CENTER

    # Format Data Rows
    for row_idx, r_data in enumerate(rows, start=1):
        bg_col = COLOR_CARD_BG if row_idx % 2 == 1 else RGBColor(241, 245, 249)
        for col_idx, val in enumerate(r_data):
            cell = table.cell(row_idx, col_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = bg_col
            p = cell.text_frame.paragraphs[0]
            p.text = str(val)
            p.font.size = Pt(11)
            p.font.color.rgb = COLOR_TEXT_MAIN
            if col_idx == 0:
                p.font.bold = True
                p.alignment = PP_ALIGN.LEFT
            else:
                p.alignment = PP_ALIGN.CENTER

    add_footer(slide, current_slide_num)
    set_speaker_notes(slide, notes)
    return slide

print("Layout builders initialized successfully!")
# ==============================================================================
# SLIDE BUILDER LOGIC — PART A: INTRODUCTION & FOUNDATIONS
# ==============================================================================

# Slide 1: Cover
create_title_slide(
    title="LANDINVEST ERP",
    subtitle="The Purpose-Built ERP for Land Partnerships, Development Syndicates & Real Estate in Bangladesh",
    client_name="[CLIENT NAME]",
    presenter_name="[PRESENTER NAME]",
    date_str="November 2026",
    notes=(
        "Welcome everyone. Today we are presenting LandInvest ERP, the first enterprise software built specifically "
        "for the way land development syndicates and real estate partnerships operate in Bangladesh. Traditional accounting "
        "software fails in this business because it cannot track Mouza, Dag, and Khatian records, cannot split plots, "
        "and cannot manage multi-partner capital accounts. Over the next 45 minutes, we will walk you through a live tour "
        "of the actual system using real screens taken directly from an active demo environment."
    )
)

# Slide 2: Executive Summary
create_content_slide(
    module_tag="Executive Summary",
    title="Transforming Land Syndicate Management",
    subtitle="A unified operating system replacing paper ledgers, fragmented spreadsheets, and partner disputes.",
    bullets_left=[
        ("Built for Bangladesh Land Realities", "Handles Mouza JL numbers, CS/SA/RS/BS Dag and Khatian surveys, Bayna advances, and Shotok/Katha/Bigha unit conversions natively."),
        ("100% Partner Financial Transparency", "Every syndicate investor can view their live capital balance, project allocations, and audited share of net realized profits."),
        ("Strict Dual-Control Treasury & Expenses", "No cash leaves the drawer or bank accounts without maker-checker approval. Complete isolation between company cash and out-of-pocket partner expenses."),
        ("Automated Sales Dues & Money Receipts", "Tracks customer installment schedules, flags 30/60/90-day overdue collections, and prints sequential official money receipts with BDT words.")
    ],
    card_right_title="The Core Promise",
    card_right_body=[
        "✔ Absolute Peace of Mind: Know your exact cash in hand, bank balances, and capital deployed at any second of the day.",
        "✔ Eliminate Partner Disputes: Replace heated meetings and disputed Excel sheets with immutable, audit-stamped capital statements.",
        "✔ Accelerate Cash Collections: Automated installment aging ensures buyers pay on schedule, funding ongoing site earthwork.",
        "✔ Bank & Tax Ready: Produce full project-wise P&L statements, voucher audit books, and asset registers with one click."
    ],
    notes=(
        "To summarize in one sentence: LandInvest is designed to give the land business owner complete peace of mind. "
        "In Bangladesh, most land syndicates face massive trust issues between partners because expenses are tracked on paper "
        "and sales collections are recorded in informal notebooks. LandInvest bridges this gap by enforcing mathematical rigor "
        "and transparency from the day you sign the Bayna deed until the final profit payout."
    )
)

# Slide 3: Agenda
create_content_slide(
    module_tag="Presentation Agenda",
    title="What We Will Cover Today",
    subtitle="A structured 5-part walkthrough of the platform, workflows, governance, and business impact.",
    bullets_left=[
        ("Part A: Foundations & Core Challenge", "The everyday struggles of land partnerships in Bangladesh and how LandInvest solves them."),
        ("Part B: Complete Product Tour (Module by Module)", "Real-screen walkthrough of Dashboard, Partners, Treasury, Land Acquisition, Plots, Expenses, Sales, and Reports."),
        ("Part C: Control, Governance & Security", "Custom role permissions (RBAC), user management, immutable audit trails, and dedicated tenant databases."),
        ("Part D: Working Together & Implementation", "The end-to-end life of a single plot, Bangladesh localization, 4-week onboarding plan, and licensing."),
        ("Appendix: Full Gallery, Glossary & Client FAQ", "Reference thumbnails of all 42 screens, land terms glossary (Bayna, Dag, Khatian), and technical FAQ.")
    ],
    card_right_title="How to Engage",
    card_right_body=[
        "• Please feel free to ask questions at any point during the module walkthroughs.",
        "• All screenshots displayed in this deck are captured live from the running system with realistic demo data.",
        "• At the end of the presentation, we can dive directly into a live interactive demonstration on any specific workflow your team handles."
    ],
    notes=(
        "Here is our agenda for today's session. We will start with a brief look at the business problem, followed by a thorough "
        "tour of every single module in the system using real screenshots. We will then examine how the software protects your data "
        "with role-based access control, walk through the actual life story of a plot from purchase to profit payout, and outline "
        "our onboarding roadmap. We have also included a full glossary and client FAQ in the appendix."
    )
)

# Slide 4: The Problem
create_content_slide(
    module_tag="The Industry Challenge",
    title="How Land Syndicates Struggle Today",
    subtitle="Manual records and generic accounting tools create mistrust, cash leakage, and missed collections.",
    bullets_left=[
        ("Excel Hell & Formula Corruption", "Syndicate accounts spread across dozens of fragile Excel workbooks where a single deleted cell corrupts partner profit shares."),
        ("Partner Mistrust & Unverified Expenses", "Managing partners spend out-of-pocket for site earthwork or legal fees, leading to bitter arguments during annual general meetings."),
        ("Hidden Cash Leakage", "Cash in hand collected from plot buyers gets mingled with personal funds or spent without sequential voucher tracking."),
        ("Uncontrolled Overdue Receivables", "Without automated installment aging, customer dues slip past 60 to 90 days unnoticed, stalling project infrastructure development.")
    ],
    card_right_title="The Human Cost",
    card_right_body=[
        "❌ Broken Partnerships: Lifelong business friendships destroyed over unrecorded expenses or disputed capital percentages.",
        "❌ Project Delays: Earthwork halts because site managers lack petty cash while millions remain uncollected from booked plots.",
        "❌ Stress During Tax Audits: Scrambling through paper sacks to find physical vouchers when authorities or auditors request proof.",
        "❌ Blind Decision Making: Business owners cannot answer basic questions: 'What is our exact net cash profit right now?'"
    ],
    notes=(
        "Every land developer in Bangladesh recognizes this painful reality. You form a partnership with four or five close associates, "
        "buy a prime piece of land, and start selling. But within six months, the Excel files become impossible to reconcile. One partner "
        "claims they paid five lakh Taka out-of-pocket for boundary walls, another partner disputes the calculation, and customers are "
        "three months behind on their installments. LandInvest was engineered specifically to make these problems permanently impossible."
    )
)

# Slide 5: The Solution
create_screenshot_slide(
    module_tag="System Overview",
    title="The Unified Solution: LandInvest ERP",
    subtitle="A single source of truth connecting capital, banking, cadastral plots, customer dues, and net profit.",
    image_filename="03_dashboard_overview.png",
    callouts=[
        ("Executive KPI Command Center", "Live cards displaying Cash in Hand, Bank Balances, Unsold Inventory, and Total Capital Deployed."),
        ("Monthly Sales Velocity Chart", "Visual comparison of new plot sales contracts signed versus actual cash collected this month."),
        ("Plot Inventory Breakdown", "Instant status breakdown showing available, booked, and sold plots across all projects.")
    ],
    notes=(
        "This is the actual Executive Dashboard of LandInvest. When you sit at your desk in the morning and log in, this is what you see. "
        "Notice item one: you instantly know your exact cash in hand, your commercial bank balances, and your total liquidity. Notice item two: "
        "the bar chart shows your sales velocity this month compared to cash collected. There is zero guessing, zero waiting for accountants "
        "to prepare reports, and zero spreadsheet formulas to maintain."
    )
)

# Slide 6: How a Land Syndicate Works
create_workflow_slide(
    module_tag="Business Workflow",
    title="How a Syndicate Operates in LandInvest",
    subtitle="A closed-loop, audit-proven lifecycle from initial capital call to final profit realization.",
    steps=[
        ("1", "Capital Pooling", "Syndicate Partners", "Deposit investment capital into designated commercial bank accounts with verified slip references.", "Partner capital accounts credited; live liquidity updated."),
        ("2", "Land Acquisition", "Managing Partner", "Execute Bayna deed, record CS/SA/RS/BS Dag numbers, Khatian, Mouza JL, and registry tax expenses.", "Project master record created with acquisition cost basis."),
        ("3", "Plot Demarcation", "Site Engineer", "Subdivide total Shotok area into saleable plots with custom sizes (3.5, 4, 5 Shotok) and unit prices.", "Plot inventory master populated with Green (Available) status."),
        ("4", "Sales & Bookings", "Sales Executive", "Sign buyer contracts, record down payment advance, and generate monthly installment schedule.", "Plot marked Booked/Sold; customer receivables ledger opened."),
        ("5", "Profit Distribution", "Business Owner", "Distribute realized net cash profit strictly on collections, crediting partner ledgers according to equity share.", "Formal dividend statement generated; capital returned first.")
    ],
    notes=(
        "Let us look at how the entire land business flows through the software. In Step 1, partners inject their capital into official "
        "bank accounts. In Step 2, you execute the land purchase, recording all survey dags and Bayna advances. In Step 3, the site team "
        "subdivides the land into cadastral plots. In Step 4, your sales staff book the plots and generate installment plans. Finally in Step 5, "
        "as cash collections arrive, the system computes your net realized profit and distributes it to partners based on their exact legal shares."
    )
)

# Slide 7: Value Delivered to Owner
create_content_slide(
    module_tag="Strategic Value",
    title="Six Pillars of Value for the Business Owner",
    subtitle="How LandInvest protects your business, your reputation, and your investment capital.",
    bullets_left=[
        ("1. Real-Time Liquidity Control", "Never bounce a cheque or run short on site payroll. Know your exact cash and bank balances 24/7."),
        ("2. Complete Partner Harmony", "Every partner receives clear, professional capital statements showing every deposit, expense, and profit credit."),
        ("3. Zero Cost Leakage", "Dual-approval workflows ensure every single Taka spent has a physical voucher and supervisory sign-off."),
        ("4. Accelerated Collections", "Automated aging reports highlight overdue customer installments before they become bad debts."),
        ("5. Tax & Legal Readiness", "Full documentation linking Dag, Khatian, deeds, mutation taxes, and customer payment receipts in one vault."),
        ("6. Complete Independence", "No longer held hostage by individual accountants or complicated spreadsheets only one person understands.")
    ],
    card_right_title="ROI Summary",
    card_right_body=[
        "💰 100% Elimination of Unrecorded Expenses: Prevent lakhs in lost receipts during earthwork and boundary wall construction.",
        "⏱ 15+ Hours Saved Weekly: No more manual reconciliation of bank statements, installment books, and partner accounts.",
        "📈 20% Faster Dues Recovery: Structured aging alerts motivate sales staff to collect pending installments on time.",
        "🤝 Faster Syndicate Formation: Prospective investors join your new projects with confidence when they see your transparent ERP."
    ],
    notes=(
        "For an owner, these six pillars represent the difference between running a stressful, chaotic operation and managing a scalable, "
        "institutional-grade land business. When your partners know they can see their capital statement at any time, their trust in you "
        "skyrockets. When your sales team knows every overdue installment is tracked automatically on the dashboard, collections speed up. "
        "And when tax authorities or banks request your books, you hand them audited reports within seconds."
    )
)

# ==============================================================================
# PART B: MODULE 1 — EXECUTIVE DASHBOARD
# ==============================================================================

# Slide 8: Part B Divider
create_section_divider(
    part_label="PART B — PRODUCT TOUR",
    section_title="Module-by-Module Walkthrough",
    summary_points=[
        "Executive Dashboard & Real-Time KPI Insights across 5 operational views",
        "Syndicate Partners Directory, Capital Injections & Personal Running Ledgers",
        "Cash in Hand Drawer, Multi-Bank Accounts & Dual-Control Contra Transfers",
        "Land Acquisition Wizard (Bayna, Dags, Khatians) & Interactive Plot Inventory",
        "Project Capex, Site Vouchers & Multi-Channel Expense Approvals",
        "Plot Sales Contracts, Customer Installment Aging & Sequential Money Receipts",
        "26 Executive Reports, Project P&L Statements & Syndicate Profit Distribution"
    ],
    notes=(
        "We are now entering Part B, which is a detailed tour of every module in LandInvest. We will examine the exact screens "
        "that your team will interact with every day, starting with the Executive Dashboard, moving through Partners, Treasury, "
        "Land Acquisition, Expenses, Sales, and Financial Reporting. Every screen you see here is captured directly from our running app."
    )
)

# Slide 9: Dashboard Overview
create_screenshot_slide(
    module_tag="Executive Dashboard",
    title="Executive Overview: Real-Time Business Pulse",
    subtitle="Your morning command center displaying liquidity, sales performance, and plot inventory status.",
    image_filename="03_dashboard_overview.png",
    callouts=[
        ("High-Level Liquidity Cards", "Cash in Hand (৳ 55.56 L), Commercial Bank Balance (৳ 1.81 Cr), and Total Liquidity (৳ 2.37 Cr)."),
        ("Monthly Sales & Collections", "Visual monthly bar chart tracking invoiced sales versus cash collected from customer installments."),
        ("Plot Inventory Breakdown", "Pie chart showing proportion of Available, Booked, and Sold plots across all syndicate projects.")
    ],
    notes=(
        "Here is the Executive Overview tab in detail. Look at callout one: at the very top, you see your Cash in Hand balance of fifty-five lakh "
        "Taka, bank balances of one point eight one crore, giving you total liquid funds of two point three seven crore. In callout two, the bar "
        "chart shows this month's collection velocity. Callout three gives you the immediate status of your land assets—how many plots are still "
        "available for sale, how many are booked, and how many are fully paid."
    )
)

# Slide 10: Financials Tab
create_screenshot_slide(
    module_tag="Executive Dashboard",
    title="Financials & Liquidity: Cash Flow & Working Capital",
    subtitle="Deep financial visibility into bank balances, cash reserves, and 30-day liquidity trends.",
    image_filename="04_dashboard_financial.png",
    callouts=[
        ("Working Capital Calculation", "Available liquid capital after reserving minimum operating thresholds for ongoing development."),
        ("30-Day Cash Flow Forecast", "Predictive trend line forecasting expected installment collections against scheduled site vendor payouts."),
        ("Bank Account Balances Split", "Real-time balance breakdown across Dutch-Bangla Bank, Islami Bank, and BRAC Bank accounts.")
    ],
    notes=(
        "Switching to the Financials tab gives the owner and the accountant deep liquidity oversight. Callout one calculates your true working "
        "capital, ensuring you don't commit to new land purchases without sufficient buffer. Callout two displays your 30-day cash flow trend, "
        "comparing incoming installment receipts with scheduled contractor payouts. Callout three breaks down your liquidity across your commercial "
        "bank accounts so you always know which bank has funds available for cheque issuance."
    )
)

# Slide 11: Projects Tab
create_screenshot_slide(
    module_tag="Executive Dashboard",
    title="Project Capex: Land Cost vs Development Spend",
    subtitle="Track acquisition cost, earthwork expenses, and sales progress project by project.",
    image_filename="05_dashboard_projects.png",
    callouts=[
        ("Capital Deployed per Project", "Breakdown of total funds invested across Green Valley City, River View Township, and Meghna Enclave."),
        ("Budget vs Actual Capex", "Comparison of original land acquisition cost plus estimated development versus actual approved site vouchers."),
        ("Project Completion & Sales Ratio", "Visual gauges showing percentage of plots sold and percentage of total revenue collected to date.")
    ],
    notes=(
        "The Projects tab focuses strictly on your land assets. In callout one, you see how much capital is currently deployed across your projects—for "
        "example, Green Valley City versus River View Township. Callout two provides an essential safeguard: budget versus actual development capex. "
        "If earthwork costs exceed your original projections, this chart alerts you immediately. Callout three shows the sales conversion progress "
        "for each project."
    )
)

# Slide 12: Sales Tab
create_screenshot_slide(
    module_tag="Executive Dashboard",
    title="Sales Velocity & Customer Dues Aging",
    subtitle="Monitor plot sales momentum, pending installments, and overdue collection risks.",
    image_filename="06_dashboard_sales.png",
    callouts=[
        ("Monthly Sales Velocity", "Track plot bookings signed per month with agreed sales values and average price per Shotok."),
        ("Total Receivables Overview", "Total uncollected customer dues (৳ 1.53 Cr) split into active installments versus overdue balances."),
        ("Overdue Receivables Warning", "Direct alert surfacing customers whose installments have passed the 30-day grace period.")
    ],
    notes=(
        "On the Sales tab, your sales director and accountants monitor customer dues. Callout one tracks sales velocity—how many plots were booked "
        "this month and at what price per Shotok. Callout two shows your total receivables—one point five three crore Taka in our demo data. "
        "Callout three is critical: it immediately isolates customers whose payments are overdue past thirty days, allowing your team to initiate "
        "courteous follow-ups before dues become problematic."
    )
)

# Slide 13: Operations Tab
create_screenshot_slide(
    module_tag="Executive Dashboard",
    title="Field Operations & Pending Approvals",
    subtitle="Bridge the gap between head office accounting and on-site engineering activities.",
    image_filename="07_dashboard_operations.png",
    callouts=[
        ("Pending Site Vouchers Count", "Number of expense vouchers submitted by site managers awaiting executive approval before payment."),
        ("Earthwork & Road Development Spend", "Cumulative expenditure on excavation, sand filling, boundary demarcations, and drainage."),
        ("Inventory Staging Status", "Real-time count of plots currently undergoing earth filling versus plots ready for customer handover.")
    ],
    notes=(
        "The Operations tab connects your head office with your field engineers. Callout one highlights pending site vouchers—bills submitted by your "
        "site supervisors that are waiting for your approval. Callout two tracks earthwork and boundary expenditures. Callout three shows the staging "
        "of your plots, so your sales team never books a plot that is still in deep water filling without setting proper customer expectations."
    )
)

# Slide 14: Automated Business Alerts
create_screenshot_slide(
    module_tag="Executive Dashboard",
    title="Automated Real-Time Business Alerts",
    subtitle="Intelligent rule-based insights alerting you to cash thresholds, pending vouchers, and overdue dues.",
    image_filename="09_dashboard_insights.png",
    callouts=[
        ("Minimum Cash Reserve Warning", "Alert triggered when Cash in Hand or total liquidity approaches the predefined threshold (৳ 10 Lakh)."),
        ("Stale Expense Vouchers Alert", "Warning displayed when site vouchers remain pending without management action for more than 3 days."),
        ("Customer Delinquency Alert", "Flags buyers with multiple consecutive missed installments requiring personal management intervention.")
    ],
    notes=(
        "One of the most powerful features of LandInvest is the Automated Business Alerts drawer shown here. You don't have to go hunting for "
        "problems—the system alerts you proactively. If your cash drawer balance drops below ten lakh Taka, you get an alert. If an expense voucher "
        "sits on your accountant's desk for more than three days, you get an alert. If a buyer misses two installments, you get an alert. "
        "It acts like a full-time financial auditor watching your business 24/7."
    )
)

# Slide 15: Dashboard Architecture
create_content_slide(
    module_tag="Executive Dashboard",
    title="Dashboard Architecture: Privacy & Flexibility",
    subtitle="Engineered for executive meetings, investor presentations, and role customization.",
    bullets_left=[
        ("One-Click Privacy Mode", "Visiting clients or non-executive staff near your desk? Click the Privacy Eye icon to instantly mask all currency figures into asterisks (৳ ••••••)."),
        ("Fiscal Year Selector (July to June)", "Switch seamlessly between FY 2024-25, FY 2025-26, and FY 2026-27. All charts, sales totals, and expense metrics update dynamically."),
        ("Role-Customized Layouts", "Owners see complete financial ledgers; site managers see plot demarcation and earthwork; sales staff see only plot prices and customer dues."),
        ("Instant PDF & Excel Export", "Export the complete dashboard summary into a branded executive report for syndicate board meetings with a single click.")
    ],
    card_right_title="Designed for Bangladesh",
    card_right_body=[
        "🇧🇩 Dual Currency Display: Formatted in authentic Bangladeshi Taka with Bengali comma grouping (৳ ২৫,০০,০০০.০০ Lakhs & Crores).",
        "🇧🇩 July-June Fiscal Cycle: Fully compliant with Bangladesh National Board of Revenue (NBR) corporate tax years.",
        "🇧🇩 Responsive on Mobile: Check site expenses, cash drawer, and plot availability from your smartphone while visiting the project site in Savar or Keraniganj."
    ],
    notes=(
        "Notice the thoughtful design touches built into the dashboard. When you have a client or a contractor sitting across your desk, you can click "
        "the Privacy Mode toggle, and every financial number is masked into asterisks so no confidential margins are visible. You can switch fiscal "
        "years instantly, and the system respects Bangladesh's standard July-to-June tax calendar. Most importantly, it works beautifully on your phone "
        "when you are standing in the field at Savar or Keraniganj."
    )
)

# ==============================================================================
# PART B: MODULE 2 — SYNDICATE PARTNERS & CAPITAL
# ==============================================================================

# Slide 16: Partners Module Overview
create_content_slide(
    module_tag="Partners & Capital",
    title="Syndicate Partners: Building Absolute Trust",
    subtitle="Eliminate the #1 cause of land partnership collapse: disputed capital contributions and unrecorded expenses.",
    bullets_left=[
        ("Centralized Partner Directory", "Maintain complete KYC profiles for every syndicate investor: full legal name, NID, emergency contact, nominee details, and TIN."),
        ("Multi-Project Syndicate Shares", "Partners can hold different ownership percentages across different projects (e.g., 25% in Green Valley, 40% in River View)."),
        ("Verified Capital Deposit Tracking", "Record every capital injection with commercial bank deposit slip numbers, cheque clearing dates, and electronic proof."),
        ("Out-of-Pocket Expense Isolation", "When a partner pays a contractor directly from their personal pocket, record it as 'PAID_BY_PARTNER'—credited to their capital ledger without leaking into company cash.")
    ],
    card_right_title="Partner Peace of Mind",
    card_right_body=[
        "🤝 Zero Guesswork: Every partner receives a personal monthly statement showing opening capital, new deposits, profit credits, and closing balance.",
        "🤝 Transparent Voting: Equity ownership percentages are locked and mathematically verified to sum to exactly 100.00% per project.",
        "🤝 Direct Dividend Payouts: When profits are distributed, payments can be credited directly back to the partner's capital account or disbursed via bank transfer."
    ],
    notes=(
        "Now let us examine Module 2: Syndicate Partners and Capital. In Bangladesh, land partnerships often fail because partner records are kept "
        "informally. One partner claims they injected thirty lakh Taka in cash, but there is no written receipt. Another partner pays an earthwork "
        "contractor forty thousand Taka from their personal wallet, and six months later everyone argues about it. LandInvest solves this permanently "
        "by treating every partner as an individual legal equity holder with a tamper-proof running ledger."
    )
)

# Slide 17: Partners Directory
create_screenshot_slide(
    module_tag="Partners & Capital",
    title="Syndicate Partners Directory",
    subtitle="Complete registry of all investment partners, contact credentials, and total capital stakes.",
    image_filename="11_partners_directory.png",
    callouts=[
        ("Partner Contact Information", "Official partner name, verified phone number, National ID (NID), and residential address."),
        ("Cumulative Capital Injected", "Total lifetime capital invested by each partner across all active syndicate land projects."),
        ("Direct Capital Action Buttons", "Quick-action shortcuts to add new capital deposits or generate an instant personal capital statement.")
    ],
    notes=(
        "Here is the Partners Directory. You can see each of your syndicate members listed cleanly with their verified contact details, NID, "
        "and their total cumulative capital invested. In our demo company, Sonar Bangla Land Developers Ltd., we have five partners, including "
        "Managing Partner Md. Rafiqul Islam and Barrister Tariq Ahmed. From this screen, you can click one button to record a new deposit or print "
        "an official statement for any individual partner."
    )
)

# Slide 18: Capital Ledger
create_screenshot_slide(
    module_tag="Partners & Capital",
    title="Partner Capital Ledger & Direct Deposits",
    subtitle="Chronological record of every capital injection, out-of-pocket credit, and dividend withdrawal.",
    image_filename="12_partners_capital_ledger.png",
    callouts=[
        ("New Capital Deposit Form", "Record deposit amount, date, receiving commercial bank account, and bank deposit slip reference."),
        ("Chronological Ledger Transactions", "Every transaction logged with type (CAPITAL_DEPOSIT, PROFIT_DISTRIBUTION, WITHDRAWAL)."),
        ("Running Partner Balance", "Calculates the live, auditable equity balance for the selected partner at any historical date.")
    ],
    notes=(
        "This is the Partner Capital Ledger. When a partner deposits money into the company bank account, your accountant opens this screen, selects "
        "the partner, enters the amount, picks the receiving bank account, and types the cheque or deposit slip number. The system immediately "
        "updates the partner's running capital balance and credits the company bank ledger simultaneously in one atomic transaction. Neither record "
        "can ever get out of sync."
    )
)

# Slide 19: Partners Analytics
create_screenshot_slide(
    module_tag="Partners & Capital",
    title="Partner Portfolio Analytics & Equity Split",
    subtitle="Visual breakdown of syndicate equity concentration, investment timelines, and realized ROI.",
    image_filename="10_partners_dashboard.png",
    callouts=[
        ("Syndicate Equity Split", "Pie chart illustrating the percentage ownership breakdown across the syndicate partners."),
        ("Capital Influx Timeline", "Historical timeline showing when capital was injected across the 22-month development cycle."),
        ("Realized Return on Capital", "Track cumulative profit dividends paid out compared to original capital contributions.")
    ],
    notes=(
        "The Partners Analytics dashboard gives the owner a bird's-eye view of syndicate equity. Callout one shows the ownership split across your "
        "investors. Callout two tracks when capital was called and received over the lifetime of the business. Callout three measures your realized "
        "return on capital. If your partners ask: 'How much cash profit have we actually received compared to what we put in?', this screen gives "
        "you the exact answer in seconds."
    )
)

# Slide 20: Partner Best Practices
create_content_slide(
    module_tag="Partners & Capital",
    title="Solving Out-of-Pocket Expenses: PAID_BY_PARTNER",
    subtitle="How LandInvest cleanly records site expenses paid directly from a partner's personal wallet.",
    bullets_left=[
        ("The Classic Industry Trap", "A partner visits the site in Keraniganj and pays ৳ 50,000 cash for urgent sand trucks. If entered as cash, company drawer balance drops, causing an immediate bank reconciliation error."),
        ("The LandInvest Solution", "When submitting the voucher, select payment channel 'PAID_BY_PARTNER' and pick the paying partner."),
        ("Zero Cash Leakage", "The system debits project development cost (so project P&L reflects true expense) and credits the partner's capital ledger directly."),
        ("Company Cash Is Untouched", "The cash drawer balance remains 100% accurate. The partner receives formal credit without waiting for manual reimbursements.")
    ],
    card_right_title="Auditor Verified",
    card_right_body=[
        "✔ Check 03 in our automated audit suite verified zero leakage across 53 partner out-of-pocket vouchers in this demo environment.",
        "✔ Both the project development cost and the partner equity ledger balanced to the exact Paisa.",
        "✔ Eliminates the need for messy petty cash reimbursement envelopes that get lost in car glove compartments."
    ],
    notes=(
        "Let us take a moment to look at a feature that every land developer loves: PAID_BY_PARTNER. When a partner goes to the project site and pays "
        "fifty thousand Taka out of his own pocket for emergency diesel or sand, how do you record it? If you enter it as cash, your office cash "
        "drawer is suddenly short fifty thousand Taka. LandInvest has a dedicated channel: it records the cost on the project, but credits the partner's "
        "capital balance directly. Your office cash drawer stays perfect, and the partner gets full legal credit on his capital statement."
    )
)

# ==============================================================================
# PART B: MODULE 3 — CASH & BANK TREASURY
# ==============================================================================

# Slide 21: Treasury Overview
create_content_slide(
    module_tag="Cash & Bank Treasury",
    title="Complete Control Over Cash & Bank Books",
    subtitle="Dual-control treasury management preventing cash leakage, unaccounted payouts, and bank discrepancies.",
    bullets_left=[
        ("Daily Cash Drawer (Petty Cash)", "Real-time cash in hand tracking for head office collections, booking advances, and daily site disbursements."),
        ("Commercial Bank & MFS Accounts", "Manage multiple corporate accounts: Dutch-Bangla Bank, Islami Bank Bangladesh, BRAC Bank, and bKash Merchant."),
        ("Dual-Control Contra Transfers", "Moving cash from drawer to bank, or withdrawing bank funds for site wages, requires Maker-Checker authorization."),
        ("Immutable Double-Entry Ledger", "Every Taka moving through the business has a verifiable Debit, Credit, sequential reference number, and timestamp.")
    ],
    card_right_title="Why Treasury Fails in Excel",
    card_right_body=[
        "❌ Missing Cash Receipts: Cash collected on Saturday is only entered on Wednesday—if at all.",
        "❌ Cheque Float Blindness: Issuing contractor cheques without knowing which previous cheques have cleared.",
        "❌ Unreconciled Bank Fees: Bank service charges and VAT quietly drain syndicate reserves.",
        "❌ Zero Fraud Protection: Anyone with Excel access can alter historical cash balances without leaving a trace."
    ],
    notes=(
        "Module 3 covers Treasury, Cash, and Banking. In the land business, millions of Taka move in cash—booking advances, site wages, sand supplier "
        "payments. If you don't have airtight treasury controls, money disappears. LandInvest maintains an immutable double-entry ledger for every "
        "cash drawer and bank account. When money moves between cash and bank, it requires dual authorization, ensuring total accountability."
    )
)

# Slide 22: Cashbook
create_screenshot_slide(
    module_tag="Cash & Bank Treasury",
    title="Daily Cash in Hand & Cash Book Ledger",
    subtitle="Live cash drawer management recording booking collections and approved petty cash payouts.",
    image_filename="14_treasury_cashbook.png",
    callouts=[
        ("Live Cash in Hand Balance", "Current physical cash drawer balance (৳ 55.56 L in our verified demo dataset)."),
        ("Cash Inflows from Sales", "Instant logging of buyer booking advances and installment collections paid in physical cash."),
        ("Approved Cash Disbursements", "Cash disbursements for approved site expense vouchers with automated voucher number cross-referencing.")
    ],
    notes=(
        "Here is the Cash Book. Look at callout one: you see the exact physical cash balance in your office drawer right now—fifty-five lakh fifty-six "
        "thousand Taka. Callout two records every cash inflow from plot buyers, automatically generating a money receipt. Callout three records cash "
        "paid out for approved site expenses. The closing balance updates in real time, so your cashier can balance the cash drawer at five o'clock "
        "every single evening."
    )
)

# Slide 23: Bank Accounts
create_screenshot_slide(
    module_tag="Cash & Bank Treasury",
    title="Commercial Bank & MFS Accounts Register",
    subtitle="Centralized management of corporate accounts across DBBL, IBBL, BRAC Bank, and digital channels.",
    image_filename="15_treasury_bank_accounts.png",
    callouts=[
        ("Commercial Bank Cards", "Individual cards showing bank name, branch, account number, routing number, and live cleared balance."),
        ("Multi-Bank Liquidity Split", "Dutch-Bangla Bank (৳ 72.4 L), Islami Bank (৳ 64.1 L), and BRAC Bank (৳ 44.5 L)."),
        ("Account Status Controls", "Toggle accounts active or inactive, and initiate instant contra fund transfers directly from the card.")
    ],
    notes=(
        "This is the Bank Accounts register. Most land companies in Bangladesh maintain accounts across multiple banks—Dutch-Bangla Bank for customer "
        "deposits, Islami Bank for syndicate transactions, and BRAC Bank for corporate expenses. LandInvest tracks all three accounts simultaneously. "
        "You see the account numbers, the branch names, and the exact cleared balance in each bank. You can also connect digital channels like "
        "bKash Merchant."
    )
)

# Slide 24: Contra Transfer
create_screenshot_slide(
    module_tag="Cash & Bank Treasury",
    title="Double-Entry Contra Fund Transfers",
    subtitle="Move funds seamlessly between cash drawers and bank accounts with zero math errors.",
    image_filename="16_treasury_contra_transfer.png",
    callouts=[
        ("Source & Destination Accounts", "Select source (e.g., Cash in Hand) and destination (e.g., Dutch-Bangla Bank Corporate)."),
        ("Transfer Amount & Reference", "Enter transferred Taka amount with mandatory bank deposit slip number or cheque reference."),
        ("Dual-Entry Journalization", "Automatically credits the source account and debits the destination account in a single atomic transaction.")
    ],
    notes=(
        "When your staff takes cash from the office and deposits it into Dutch-Bangla Bank, how is it recorded? In LandInvest, you use the Contra "
        "Transfer feature shown here. Callout one lets you select the source and destination. Callout two requires a deposit slip or cheque reference. "
        "Callout three performs a double-entry contra transfer: it reduces your cash drawer and increases your bank balance simultaneously. It is "
        "mathematically impossible for money to be deducted from one account without appearing in the other."
    )
)

# Slide 25: Treasury Transactions
create_screenshot_slide(
    module_tag="Cash & Bank Treasury",
    title="Treasury Running Transactions Ledger",
    subtitle="Complete chronological double-entry history of every Taka moving through the enterprise.",
    image_filename="17_treasury_transactions.png",
    callouts=[
        ("Chronological Event Log", "Timestamped record of every cash receipt, bank transfer, supplier payout, and partner deposit."),
        ("Debit & Credit Columns", "Formal accounting format displaying inflow (Debit) and outflow (Credit) with running balance."),
        ("Sequential Voucher & MR Links", "Clickable cross-references linking directly to the underlying Money Receipt or Expense Voucher.")
    ],
    notes=(
        "Here is the complete Treasury Ledger. Over our 22-month demo period, this ledger recorded 638 individual transactions. Every single entry "
        "has a timestamp, a transaction type, a debit or credit amount, and a running balance. Notice callout three: every entry has a clickable link "
        "to the original money receipt or physical expense voucher, so if your auditor wants to verify any transaction from six months ago, they "
        "can pull up the original document in one second."
    )
)

# Slide 26: Treasury Approvals
create_screenshot_slide(
    module_tag="Cash & Bank Treasury",
    title="Maker-Checker Treasury Transfer Approvals",
    subtitle="Dual-authorization workflow preventing unauthorized cash withdrawals or bank transfers.",
    image_filename="18_treasury_approvals.png",
    callouts=[
        ("Pending Contra Transfers Queue", "Transfers queued by the accountant awaiting executive review before ledger balances update."),
        ("Transfer Audit Information", "Displays requesting user, timestamp, source/destination accounts, and attached deposit receipt."),
        ("One-Click Authorization", "Owner or Managing Partner can approve or reject transfers with a mandatory rejection reason.")
    ],
    notes=(
        "This is the Maker-Checker Treasury Approval Queue. In standard accounting practice, the person who enters a transfer should not be the person "
        "who approves it. Here, your accountant queues the transfer after sending staff to the bank with a deposit slip. The money does not reflect in "
        "the bank balance until the Owner or Managing Partner reviews the slip and clicks 'Approve' on this screen. This provides complete protection "
        "against internal fraud."
    )
)

# ==============================================================================
# PART B: MODULE 4 — LAND PROJECTS & CADASTRAL PLOTS
# ==============================================================================

# Slide 27: Land Module Overview
create_content_slide(
    module_tag="Land Projects & Acquisition",
    title="Built for Bangladesh Land Realities",
    subtitle="Natively manages Mouza JL numbers, CS/SA/RS/BS Dag surveys, Khatian records, and cadastral plots.",
    bullets_left=[
        ("Cadastral Survey Hierarchy", "Track every parcel of land across historical government surveys: CS (Cadastral Survey), SA (State Acquisition), RS (Revisional Survey), and BS/City (Bangladesh Survey)."),
        ("Mouza & JL Number Identification", "Organize land by district, upazila, Mouza name, and official Jurisdiction List (JL) numbers."),
        ("Bayna to Final Registry Workflow", "Track initial Bayna agreement advance, registration stamp duty costs, mutation taxes (Khajna), and sub-registry fees."),
        ("Shotok, Katha & Bigha Conversions", "Enter land area in Shotok (Decimals) with automatic real-time conversion into Katha (1.65 Shotok) and Bigha (33 Shotok).")
    ],
    card_right_title="Why Generic Software Fails",
    card_right_body=[
        "❌ No Survey Fields: Standard software like QuickBooks or Tally has no concept of Dag, Khatian, or Mouza numbers.",
        "❌ Cannot Subdivide Land: Cannot take a 150 Shotok parcel, subtract 30 Shotok for roads, and automatically generate 30 individual saleable plots.",
        "❌ Mismatched Units: Generic software forces square feet or square meters, causing rounding errors when dealing with Katha and Shotok.",
        "❌ Disconnected Sales: Sales contracts cannot be locked to a specific physical plot number on a surveyed master plan."
    ],
    notes=(
        "Module 4 is where LandInvest truly shines: Land Projects and Cadastral Plots. Generic software like QuickBooks or Tally knows nothing about "
        "Bangladesh land laws. It has no fields for Mouza, CS, SA, RS, or BS Dags. It cannot calculate Bayna advances versus mutation tax. LandInvest "
        "was built from the ground up for Bangladeshi land developers. It understands that one Katha equals one point six five Shotok, and it allows "
        "you to subdivide raw farmland into surveyed residential plots."
    )
)

# Slide 28: Projects All
create_screenshot_slide(
    module_tag="Land Projects & Acquisition",
    title="Land Projects Master Register",
    subtitle="Portfolio overview of all active, development, and sold-out land projects.",
    image_filename="19_projects_all.png",
    callouts=[
        ("Project Status Lifecycle Tags", "Clear badges: UNDER_BAYNA (Acquisition), DEVELOPMENT (Earthwork), SELLING (Sales Active), SOLD_OUT (Completed)."),
        ("Project Vital Statistics", "Location, Mouza name, JL number, total land area in Shotok, and purchase price."),
        ("Live Financial Progress Bars", "Visual indicator showing capital deployed, approved development costs, and sales revenue collected.")
    ],
    notes=(
        "Here is the Land Projects Master Register. You see all your projects in one place. In our demo company, we have six projects: Green Valley City, "
        "River View Township, Meghna Enclave, Padma Garden, Jamuna Eco Park, and Shitalakshya Green. Notice the status badges: Green Valley is SOLD_OUT, "
        "River View is actively SELLING, and Meghna Enclave is in DEVELOPMENT. You immediately see the total Shotok area, acquisition cost, and revenue."
    )
)

# Slide 29: Acquisition Wizard
create_screenshot_slide(
    module_tag="Land Projects & Acquisition",
    title="Land Acquisition Wizard",
    subtitle="Structured multi-step wizard capturing land seller, survey dags, Khatians, Bayna, and partner shares.",
    image_filename="20_projects_new_wizard.png",
    callouts=[
        ("Survey Identity Records", "Enter Mouza name, JL Number, CS/SA/RS/BS Dag numbers, and corresponding Khatian records."),
        ("Acquisition Cost Breakdown", "Record negotiated purchase price, Bayna advance amount, registration stamp tax, and mutation expenses."),
        ("Syndicate Partner Share Allocations", "Assign exact equity ownership percentages to participating syndicate partners (must sum to 100%).")
    ],
    notes=(
        "When you buy a new parcel of land, your team uses the New Acquisition Wizard shown here. Callout one captures the legal survey details: "
        "Mouza, JL number, CS Dag, SA Dag, RS Dag, BS Dag, and Khatians. Callout two captures the financial terms: total purchase price, Bayna advance, "
        "stamp duty, and mutation costs. Callout three lets you assign the partner ownership shares for this specific project. It prevents mistakes "
        "before you even start development."
    )
)

# Slide 30: Plots Table View
create_screenshot_slide(
    module_tag="Land Projects & Acquisition",
    title="Cadastral Plots Master Inventory (Table View)",
    subtitle="Detailed spreadsheet-like inventory of every individual plot, size, price, and booking status.",
    image_filename="21_projects_plots_table.png",
    callouts=[
        ("Comprehensive Plot Filters", "Filter plots by Project, Status (Available, Booked, Sold), Size (Shotok), or Asking Price range."),
        ("Cadastral Plot Details", "Plot Number (e.g., RV-12), Plot Size in Shotok & Katha, Facing, Road Width, and Asking Price per Shotok."),
        ("Direct Action Controls", "Initiate plot bookings, modify asking prices, or view linked customer sales contracts in one click.")
    ],
    notes=(
        "Here is the Cadastral Plots Master Inventory in Table View. Over our six projects, we have 158 individual plots. Every plot has a unique "
        "number like RV-12, an exact size in Shotok (for example, 4.00 Shotok), its asking price, and its current status. Your sales team can filter "
        "by project and status in real time, so when a prospective buyer walks into your office asking for a 4 Shotok south-facing plot in River View, "
        "your sales executive can find it in three seconds."
    )
)

# Slide 31: Plots Grid View
create_screenshot_slide(
    module_tag="Land Projects & Acquisition",
    title="Visual Color-Coded Plot Grid",
    subtitle="Interactive visual map showing real-time plot availability, reservations, and sales.",
    image_filename="22_projects_plots_grid.png",
    callouts=[
        ("Green Tiles — Available", "Plots ready for immediate customer booking with visible plot number and asking price."),
        ("Yellow Tiles — Booked", "Plots reserved under active customer booking contracts awaiting full installment completion."),
        ("Blue / Gray Tiles — Sold", "Plots fully paid off by customers and ready for official Sub-Registry deed registration.")
    ],
    notes=(
        "For business owners who prefer a visual layout, LandInvest provides the Interactive Plot Grid. Each tile represents a physical plot on your "
        "master plan. Green tiles are available for sale. Yellow tiles are booked with installments actively being collected. Blue tiles are 100% "
        "sold out. When a customer sits at your sales desk, you can put this screen on the wall display. It looks highly professional and creates "
        "immediate urgency for buyers to book remaining green plots."
    )
)

# Slide 32: Project Master Detail
create_screenshot_slide(
    module_tag="Land Projects & Acquisition",
    title="Project Master File: River View Township",
    subtitle="Comprehensive project dossier tracking land costs, infrastructure capex, plot sales, and net profit.",
    image_filename="23_project_detail_master.png",
    callouts=[
        ("Project Vital Headline KPIs", "220.00 Shotok area, ৳ 2.80 Cr land cost, ৳ 3.51 Cr total capex, and ৳ 4.88 Cr projected gross revenue."),
        ("Deep-Dive Navigation Tabs", "Switch between Overview, Plots Inventory (55 plots), Approved Expenses, Syndicate Partners, and Sales."),
        ("Survey Survey & Legal Dossier", "Permanent storage of CS/SA/RS/BS survey numbers, JL #88, and linked scanned deed documents.")
    ],
    notes=(
        "This is the Project Master Dossier for River View Township in Keraniganj. At the top, you see the project vitals: 220 Shotok total area, "
        "two point eight crore acquisition price, fifty-five planned plots, and four point eight eight crore projected revenue. The tabs below let "
        "you dive straight into the 55 individual plots, review every approved expense voucher, inspect partner shares, and examine every customer "
        "sale contract. It is the complete master file for the project."
    )
)

# ==============================================================================
# PART B: MODULE 5 — PROJECT EXPENSES & VOUCHER MANAGEMENT
# ==============================================================================

# Slide 33: Expenses Overview
create_content_slide(
    module_tag="Expenses & Vouchers",
    title="Controlling Development Capex & Site Vouchers",
    subtitle="Airtight expenditure controls stopping unapproved spending, missing receipts, and vendor overbilling.",
    bullets_left=[
        ("Standard Land Cost Categories", "Pre-configured cost heads: Earthwork & Sand Filling, Boundary Demarcation, Internal Road Paving, Drainage, Legal & Mutation Fees, Site Office, and Security."),
        ("Mandatory Voucher Numbering", "Every expense receives a unique sequential voucher ID (VCH-0001, VCH-0002) cross-referenced to physical paper receipts."),
        ("Maker-Checker Approval Workflow", "Field supervisors enter expenses with attached bill photos. Expenses sit in PENDING status with zero ledger impact until executive approval."),
        ("Three Flexible Payment Channels", "Disburse via Cash in Hand, Commercial Bank Cheque, or mark as PAID_BY_PARTNER for out-of-pocket partner expenditures.")
    ],
    card_right_title="Zero Leakage Safeguards",
    card_right_body=[
        "🛑 Zero Phantom Expenses: No expense hits your financial reports without executive approval and attached proof.",
        "🛑 Capitalization Control: Only APPROVED expenses are capitalized into project development cost; rejected vouchers are completely excluded.",
        "🛑 Audit Verified: In our demo suite, exactly ৳ 11.95 Cr in approved expenses was capitalized, while ৳ 15.3 L in pending/rejected vouchers was strictly isolated."
    ],
    notes=(
        "Module 5 covers Project Expenses and Voucher Management. In land development, earthwork and sand filling can easily eat away your profits "
        "if costs are not tightly supervised. LandInvest enforces strict maker-checker controls. Your site manager submits the voucher from his phone "
        "with a photo of the truck slip or supplier invoice. It stays in PENDING status. It does not touch your cash drawer, and it does not affect "
        "your project profit until you or your managing partner approve it."
    )
)

# Slide 34: Expenses All
create_screenshot_slide(
    module_tag="Expenses & Vouchers",
    title="Project Expenses Master Register",
    subtitle="Searchable registry of all development expenditures, cost heads, voucher numbers, and approval states.",
    image_filename="25_expenses_all.png",
    callouts=[
        ("Multi-Dimensional Filters", "Filter expenses by Project, Cost Category (Earthwork, Demarcation, Legal), Date Range, or Status."),
        ("Voucher Identification & Vendor", "Sequential Voucher ID, payee/vendor name, expense description, and payment method tag."),
        ("Approval Status Badges", "Clear visual indicators: APPROVED (Green), PENDING (Yellow), or REJECTED (Red).")
    ],
    notes=(
        "Here is the Expenses Master Register. Across our demo projects, we have 152 expense vouchers. Notice the filter bar at the top: you can filter "
        "by project, by cost category like Earthwork or Demarcation, or by date range. Callout two shows the sequential voucher ID, the vendor name, "
        "and the payment method. Callout three shows the approval status. You have complete transparency over every Taka spent."
    )
)

# Slide 35: Expenses Approvals
create_screenshot_slide(
    module_tag="Expenses & Vouchers",
    title="Dual-Approval Expense Voucher Queue",
    subtitle="Executive authorization screen for reviewing site expenses before financial ledger impact.",
    image_filename="26_expenses_approvals.png",
    callouts=[
        ("Pending Expense Vouchers Queue", "All unapproved vouchers submitted by site engineers waiting for management verification."),
        ("Voucher Supporting Evidence", "Review attached photos of physical bills, supplier chalan, quantity metrics, and site notes."),
        ("Approve or Reject Actions", "One-click 'Approve' to authorize payment and capitalize cost, or 'Reject' with feedback to the field.")
    ],
    notes=(
        "This is the Expense Approval Queue—a favorite screen for managing partners and owners. When your site engineer buys diesel or pays sand "
        "truck laborers, the voucher appears here. You see the date, the vendor, the amount, and you can inspect the photo of the chalan or receipt. "
        "If everything looks correct, you click 'Approve'. Only then does the cash get deducted and the cost get added to the project. If something "
        "looks inflated, you reject it instantly."
    )
)

# Slide 36: Expenses Breakdown
create_screenshot_slide(
    module_tag="Expenses & Vouchers",
    title="Category & Head-Wise Expense Breakdown",
    subtitle="Detailed cost distribution analytics comparing earthwork, civil works, legal, and operational expenses.",
    image_filename="27_expenses_breakdown.png",
    callouts=[
        ("Category Cost Distribution Chart", "Visual bar and pie charts comparing spend across Earthwork, Boundary Walls, Roads, and Legal."),
        ("Project Cost Comparison", "Compare development expenditure per Shotok across Green Valley City versus River View Township."),
        ("Vendor & Head-Wise Summary", "Drill-down table showing total Taka paid to sand suppliers, earthmoving contractors, and legal consultants.")
    ],
    notes=(
        "The Expense Breakdown screen provides deep operational analytics. Callout one compares expenditures across categories—how much went into sand "
        "filling versus boundary demarcation versus road construction. Callout two lets you compare cost per Shotok across different projects. If "
        "earthwork at River View is costing 30% more per Shotok than Green Valley, you can investigate contractor rates immediately. Callout three "
        "summarizes total payments by vendor."
    )
)

# Slide 37: Physical Vouchers Register
create_screenshot_slide(
    module_tag="Expenses & Vouchers",
    title="Physical Voucher Register & Storage",
    subtitle="Permanent digital document vault linking paper vouchers, chalans, and receipts to ledger entries.",
    image_filename="28_vouchers_register.png",
    callouts=[
        ("Sequential Voucher Index", "Complete numbered registry (VCH-0001 through VCH-0152) corresponding to physical office binder files."),
        ("Scanned Document Previews", "Clickable preview of scanned physical paper vouchers, revenue stamps, and cash memos."),
        ("Auditor Verification Status", "Every voucher stamped with creator name, approver name, authorization timestamp, and ledger transaction ID.")
    ],
    notes=(
        "In Bangladesh, tax auditors and syndicate partners always want to see physical paper vouchers with revenue stamps. LandInvest provides the "
        "Physical Voucher Register shown here. Every digital transaction corresponds to a numbered paper voucher in your office binder. Callout two "
        "shows the attached scanned document, complete with stamps and signatures. When tax authorities or partner auditors visit, you don't search "
        "through dusty boxes—you pull up the exact voucher on screen."
    )
)

# Slide 38: Expense Workflow
create_workflow_slide(
    module_tag="Expenses & Vouchers",
    title="The End-to-End Expense Lifecycle",
    subtitle="From site supervisor chalan submission to final financial ledger capitalization.",
    steps=[
        ("1", "Voucher Entry", "Site Supervisor", "Submit voucher via smartphone with expense category, vendor name, amount, and photo of physical bill.", "Voucher created with PENDING status; zero ledger impact."),
        ("2", "Management Review", "Accountant / Managing Partner", "Verify bill authenticity, contractor rates, and check physical voucher document.", "Voucher verified against project budget thresholds."),
        ("3", "Executive Approval", "Owner / Managing Partner", "Approve voucher with single click. System authorizes payment disbursement.", "Voucher status changes to APPROVED; audit log updated."),
        ("4", "Payment Disbursement", "Cashier / Bank Officer", "Disburse funds via Cash in Hand, Bank Cheque, or credit Partner Capital ledger.", "Treasury ledger debited; payment reference recorded."),
        ("5", "Cost Capitalization", "LandInvest Engine", "Automatically capitalize approved expense into project development cost basis.", "Project P&L and cost statement updated in real time.")
    ],
    notes=(
        "Here is the step-by-step workflow of how an expense moves through LandInvest. First, the site supervisor enters the bill and snaps a photo. "
        "Second, the accountant verifies the chalan. Third, the owner or managing partner approves it. Fourth, the cashier disburses the cash or "
        "issues the bank cheque. Finally, LandInvest capitalizes the cost into the project's P&L statement automatically. It guarantees that not a "
        "single Taka is ever spent without proper authorization."
    )
)

# ==============================================================================
# PART B: MODULE 6 — PLOT SALES, INSTALLMENTS & MONEY RECEIPTS
# ==============================================================================

# Slide 39: Sales Overview
create_content_slide(
    module_tag="Plot Sales & Collections",
    title="Accelerating Sales & Streamlining Customer Dues",
    subtitle="From booking agreements and flexible installment schedules to printed money receipts.",
    bullets_left=[
        ("Rigorous Sale Contracts", "Bind customer contracts to specific surveyed plot numbers with verified buyer NID, phone, and nominee records."),
        ("Custom Installment Schedules", "Configure down payments (Bayna / Booking money) and flexible installment tenures (6, 12, 24, 36 months)."),
        ("Strict Overpayment Guards", "The system mathematically prevents collecting more than the agreed total price, avoiding accounting disputes."),
        ("Sequential Money Receipts", "Generates official Money Receipts (MR-0001, MR-0002) with BDT amounts in numerals, Bengali words, and printable layout.")
    ],
    card_right_title="Protecting Your Revenue",
    card_right_body=[
        "🎯 Never Double-Book a Plot: When a plot is booked, its status locks instantly across all sales staff and displays as Booked on the grid.",
        "🎯 Automated Installment Due Dates: Customers and staff receive automated reminders before installment due dates arrive.",
        "🎯 100% Reconciled Sales: Every single collected Taka links directly to a treasury ledger entry and an official Money Receipt."
    ],
    notes=(
        "Module 6 handles Plot Sales, Installments, and Collections. Selling land plots on installments is the lifeblood of real estate cash flow "
        "in Bangladesh. But managing 50 or 100 buyers paying monthly installments on different dates is an administrative nightmare without software. "
        "LandInvest manages the entire sales contract, generates the monthly payment schedule, prevents double-booking, and prints official sequential "
        "Money Receipts with amounts in words."
    )
)

# Slide 40: Sales All
create_screenshot_slide(
    module_tag="Plot Sales & Collections",
    title="Plot Sales Contracts & Buyer Directory",
    subtitle="Master customer sales register tracking contract values, booking advances, and remaining balances.",
    image_filename="29_sales_all.png",
    callouts=[
        ("Buyer Information & Plot Assignment", "Customer name, verified phone number, project name, and assigned plot number (e.g., GV-01, RV-12)."),
        ("Financial Contract Metrics", "Total Agreed Price, Booking Advance Paid, Total Collections to Date, and Current Due Balance."),
        ("Sales Status Indicators", "Status badges: BOOKED (Active installments), SOLD (Paid in full), or CANCELLED.")
    ],
    notes=(
        "Here is the Plot Sales Register. Across our demo projects, we have 62 active and completed sales contracts. Look at callout one: you see "
        "the buyer's name, phone number, project, and plot number. Callout two shows the financial progress: agreed total price, advance booking money "
        "paid, cumulative collections to date, and the remaining due balance. Callout three shows whether the plot is actively in installments or "
        "fully paid off."
    )
)

# Slide 41: Sales Bookings Form
create_screenshot_slide(
    module_tag="Plot Sales & Collections",
    title="New Plot Booking & Sale Contract Generator",
    subtitle="Quickly create legally sound customer sales agreements with automated installment schedules.",
    image_filename="30_sales_bookings.png",
    callouts=[
        ("Plot Selector & Price Autofill", "Selecting an available plot automatically populates its surveyed Shotok size and default asking price."),
        ("Buyer Legal Credentials", "Capture buyer full name, NID number, mobile phone, present address, and permanent village address."),
        ("Flexible Installment Plan Generator", "Set advance booking deposit, number of monthly installments, installment frequency, and start date.")
    ],
    notes=(
        "When a buyer agrees to purchase a plot, your sales executive opens the New Booking Form. When they pick an available plot, the software "
        "automatically populates its Shotok size and asking price. The executive enters the buyer's NID and mobile number. Then, in callout three, "
        "they configure the payment terms—for example, five lakh Taka down payment and twenty-four monthly installments. The system generates the "
        "complete installment schedule instantly."
    )
)

# Slide 42: Sales Dues Aging
create_screenshot_slide(
    module_tag="Plot Sales & Collections",
    title="Customer Installment Dues & Aging Analysis",
    subtitle="Automated collection tracking isolating current dues, 30-day, 60-day, and 90-day overdue accounts.",
    image_filename="31_sales_dues.png",
    callouts=[
        ("Receivables Aging Summary Cards", "Visual summary cards breaking down receivables into Current, 30 Days Past Due, 60 Days, and 90+ Days."),
        ("Delinquent Customer List", "Actionable table highlighting overdue buyers with direct phone links, overdue installment count, and late amounts."),
        ("Direct Collection Action", "Click 'Collect' to open instant installment payment drawer and issue an official receipt on the spot.")
    ],
    notes=(
        "This screen is your collection engine: Customer Installment Dues and Aging Analysis. Callout one breaks down your receivables into aging "
        "buckets: how much is due this month, how much is 30 days overdue, and how much is over 90 days. Callout two lists the exact customers who "
        "are behind schedule, with their phone numbers. Your collection team can work down this list every Monday morning and record payments directly."
    )
)

# Slide 43: Contract Detail & Installments
create_screenshot_slide(
    module_tag="Plot Sales & Collections",
    title="Customer Contract Ledger & Installment Schedule",
    subtitle="Individual customer dossier showing payment history, installment schedule, and remaining dues.",
    image_filename="32_sales_contract_detail.png",
    callouts=[
        ("Customer Contract Headline", "Buyer Golam Mustafa — Agreed Price: ৳ 15.75 Lakh | Current Due: ৳ 0.00 (SOLD / PAID IN FULL)."),
        ("Installment Collection Drawer", "Collect incoming installment payments via Cash in Hand or Commercial Bank with automated validation."),
        ("Payment History & Receipt Links", "Complete chronological table of every installment received with date, payment method, and Receipt #MR-0457.")
    ],
    notes=(
        "This is the individual Customer Contract Dossier. In this example, buyer Golam Mustafa purchased Plot RV-12 in River View Township for fifteen "
        "point seven five lakh Taka. You can see his complete payment history. Every time he paid an installment, the system recorded the date, the "
        "amount, the payment channel, and the official Money Receipt number. Notice that when his final installment was paid, his status automatically "
        "updated to SOLD and PAID IN FULL."
    )
)

# Slide 44: Money Receipt Preview
create_screenshot_slide(
    module_tag="Plot Sales & Collections",
    title="Official Sequential Money Receipt",
    subtitle="Branded, sequentially numbered money receipt with amounts in Bengali words and official signature blocks.",
    image_filename="32b_money_receipt.png",
    callouts=[
        ("Official Company Letterhead", "Sonar Bangla Land Developers Ltd. corporate header, registered office, and sequential receipt number (MR-0457)."),
        ("Payment & Plot Particulars", "Buyer name, phone, plot number (RV-12, 4.00 Shotok), booking number, and payment mode (CASH)."),
        ("Amount in Numbers & Words", "BDT ৳ 4,72,500.00 displayed in numerals and in formal English words ('Four Lakh Seventy-Two Thousand Five Hundred Taka Only').")
    ],
    notes=(
        "Here is the official Money Receipt generated by LandInvest. It is beautifully designed, professional, and ready for instant printing or "
        "PDF download. Notice the sequential receipt number MR-0457. It lists the buyer's details, the exact plot number and Shotok area, and prints "
        "the Taka amount in both numerals and formal words to prevent any handwriting alterations. There are dedicated signature blocks for the "
        "accountant, customer, and managing director."
    )
)

# ==============================================================================
# PART B: MODULE 7 — FINANCIAL REPORTS & P&L
# ==============================================================================

# Slide 45: Reports Catalog
create_screenshot_slide(
    module_tag="Reports & Accounting",
    title="Executive Reports Catalog: 26 Standard Reports",
    subtitle="A comprehensive library of institutional reports across Financials, Partners, Projects, Treasury, and Sales.",
    image_filename="33_reports_catalog.png",
    callouts=[
        ("Six Categorized Report Domains", "Filter catalog by Financial, Partners, Projects, Treasury, Sales, and Audit domains."),
        ("Grid & List Catalog Views", "Switch between visual card view and compact list view with detailed report descriptions."),
        ("Instant PDF & Excel Export", "Every report includes one-click export to formatted Excel spreadsheets and print-ready PDF documents.")
    ],
    notes=(
        "Module 7 is our Financial Reporting and Profit Realization suite. LandInvest includes 26 pre-built standard reports covering every aspect of "
        "your land business. You have Financial Statements, Partner Capital Reports, Project Profitability, Treasury Reconciliations, and Sales Aging. "
        "Every single report can be exported to Excel or PDF with one click. You will never need to manually build another reporting spreadsheet."
    )
)

# Slide 46: Project P&L Report
create_screenshot_slide(
    module_tag="Reports & Accounting",
    title="Project Profit & Loss (P&L) Statement",
    subtitle="Audited financial statement comparing land acquisition, development capex, realized sales, and net profit.",
    image_filename="34_reports_project_pnl.png",
    callouts=[
        ("Project Revenue & Cost Summary", "Gross Invoiced Sales, Actual Realized Cash Collections, Total Land Cost, and Approved Development Capex."),
        ("Realized vs Unrealized Margin", "Distinguishes between cash collected in the bank versus future installments still due from customers."),
        ("Syndicate Partner Net Profit Allocation", "Automatic calculation of net realized profit distributed to each partner according to equity share.")
    ],
    notes=(
        "This is the core financial document of any syndicate: the Project Profit and Loss Statement. Callout one summarizes your total numbers: "
        "gross invoiced sales, cash collected, land purchase price, and development expenses. Callout two calculates your true realized cash profit. "
        "And callout three shows the exact dividend distribution to each partner. In our demo for Green Valley City, the syndicate achieved a net "
        "realized profit of one point three nine crore Taka, distributed in full across the partners with an ROI exceeding 57%."
    )
)

# Slide 47: Partner Capital Report
create_screenshot_slide(
    module_tag="Reports & Accounting",
    title="Partner Capital Running Statement",
    subtitle="Individual partner capital account showing opening equity, deposits, profit allocations, and withdrawals.",
    image_filename="35_reports_partner_capital.png",
    callouts=[
        ("Partner Selection & Date Range", "Select any individual syndicate partner and choose specific fiscal year or custom date ranges."),
        ("Running Capital Activity Ledger", "Detailed audit table logging every capital injection, out-of-pocket expense credit, and dividend payout."),
        ("Certified Closing Equity Balance", "Official closing capital balance ready for board sign-off and annual income tax filing.")
    ],
    notes=(
        "Here is the Partner Capital Running Statement. Every partner can be handed this exact statement. It shows their opening balance on January "
        "first, every deposit they made, every site expense they paid out of their personal pocket, every profit dividend they were credited, and "
        "their closing equity. It provides total financial closure and eliminates any possibility of partner suspicion or misunderstanding."
    )
)

# Slide 48: Bengali Reports
create_screenshot_slide(
    module_tag="Reports & Accounting",
    title="Bilingual Reporting: 100% Native Bengali Mode",
    subtitle="Full Bengali language support for all financial statements, numerals, and land terminology.",
    image_filename="36_reports_bengali.png",
    callouts=[
        ("One-Click Language Switcher", "Toggle seamlessly between English and Bengali across the entire application interface."),
        ("Bengali Financial Terminology", "All headings, categories, and metrics translated into standard business Bengali (e.g., লাভ-ক্ষতি, মোট ব্যয়)."),
        ("Localized Numeral Formatting", "Numbers automatically formatted with Bengali numerals and comma separators (e.g., ৳ ১,৩৯,৪৮,৬৪৪.০০).")
    ],
    notes=(
        "Many senior business partners and traditional landowners in Bangladesh prefer reviewing accounts in Bengali. LandInvest features full native "
        "Bengali language support. With one click on the language toggle, every report, every table heading, and every currency figure is translated "
        "into clear business Bengali with authentic Bengali numerals. It ensures every partner, regardless of their English fluency, feels completely "
        "comfortable reviewing the accounts."
    )
)

# Slide 49: Profit Distribution Mechanics
create_content_slide(
    module_tag="Reports & Accounting",
    title="The Math of Syndicate Profit Distribution",
    subtitle="How LandInvest enforces ethical, audit-compliant profit distribution based on cash collections.",
    bullets_left=[
        ("1. Realized Cash Principle", "Profit is calculated strictly on cash collected in the bank, NOT on uncollected future paper sales."),
        ("2. Capital Return Before Profit", "Partners receive their initial invested capital back in full before any net profit dividends are unlocked."),
        ("3. Approved Expense Deduction", "Only approved development expenses (sand filling, road paving, demarcation) are deducted from sales revenue."),
        ("4. Strict Equity Share Allocation", "Net profit is divided to the exact Paisa according to each partner's registered ownership percentage.")
    ],
    card_right_title="Distribution Formula",
    card_right_body=[
        "Net Realized Profit = Total Cash Collections - (Land Purchase Cost + Registration Tax + Approved Development Capex)",
        "",
        "Partner Share = Net Realized Profit × Partner Equity %",
        "",
        "✔ Green Valley City Case Study: ৳ 3.84 Cr Sales Collected - ৳ 2.45 Cr Total Investment = ৳ 1.39 Cr Net Realized Profit distributed 100% across 3 rounds with zero disputes."
    ],
    notes=(
        "Let us review the mathematical formula LandInvest uses for profit distribution. First, it enforces the Realized Cash Principle: you never "
        "distribute paper profits from uncollected installments. Second, partners always get their principal investment capital returned first. Third, "
        "only approved, verified site expenses are deducted. Finally, the remaining net profit is split according to equity percentages. In Green "
        "Valley City, this formula distributed one point three nine crore Taka across three rounds with zero partner complaints."
    )
)

# ==============================================================================
# PART C: CONTROL, GOVERNANCE & SECURITY
# ==============================================================================

# Slide 50: Part C Divider
create_section_divider(
    part_label="PART C — CONTROL & GOVERNANCE",
    section_title="Security, Roles & Data Protection",
    summary_points=[
        "Role-Based Access Control (RBAC) with granular, feature-by-feature permissions",
        "Team User Management: onboarding staff, assigning roles, and secure offboarding",
        "Immutable System Audit Trail tracking every create, update, and approve action",
        "Multi-Tenant Database Isolation ensuring your business data is 100% private"
    ],
    notes=(
        "We now move into Part C: Control, Governance, and Security. When you deploy enterprise software for your land business, you need complete "
        "control over who can see what. You do not want your sales executives seeing your land acquisition costs or your bank balances. You do not "
        "want site managers approving their own expense vouchers. In this section, we show you how LandInvest enforces ironclad role-based security."
    )
)

# Slide 51: RBAC Roles
create_screenshot_slide(
    module_tag="Control & Governance",
    title="Role-Based Access Control (RBAC) Matrix",
    subtitle="Create custom roles and configure exact granular permissions across all modules.",
    image_filename="39_settings_roles.png",
    callouts=[
        ("System vs Custom Roles", "Built-in roles (Owner, Managing Partner) plus customizable team roles (Accountant, Site Manager, Sales Executive)."),
        ("Granular Permission Matrix", "Over 60 individual toggles controlling access to dashboards, expenses, sales pricing, treasury, and reports."),
        ("Role Duplication Shortcut", "Duplicate any existing role with one click to create specialized sub-roles (e.g., Senior Accountant vs Junior Cashier).")
    ],
    notes=(
        "Here is the Role-Based Access Control editor. In LandInvest, you don't just give someone 'admin' or 'user' access. You configure exact "
        "permissions across more than sixty feature toggles. You can define what they can view, what they can create, what they can edit, and what "
        "they can approve. In callout three, you can duplicate an existing role with one click to create specialized roles for your organization."
    )
)

# Slide 52: User Management
create_screenshot_slide(
    module_tag="Control & Governance",
    title="Team User Management & Access Control",
    subtitle="Add team members, assign specific roles, send email invites, and manage staff offboarding.",
    image_filename="38_settings_users.png",
    callouts=[
        ("Active Team Directory", "List of all active corporate users with their full name, login email, assigned role, and last login timestamp."),
        ("Role Assignment Selector", "Assign or update user roles instantly; changes take effect immediately across all active browser sessions."),
        ("Instant Deactivation Control", "Deactivate departing staff with one click, immediately terminating their access while preserving all audit logs.")
    ],
    notes=(
        "This is the User Management screen. You see all your active staff members, their login emails, and their assigned roles. If an employee "
        "leaves your firm, callout three lets you deactivate their account with a single click. Their login is terminated immediately across all "
        "devices, but every voucher they created and every payment they recorded remains permanently preserved in your audit trail."
    )
)

# Slide 53: Role Comparison Table
create_table_slide(
    module_tag="Control & Governance",
    title="Role Visibility & Operational Boundary Matrix",
    subtitle="Strict separation of duties ensuring employees only see data required for their daily tasks.",
    headers=["Operational Area", "Owner (MD)", "Managing Partner", "Accountant", "Site Manager", "Sales Executive", "Auditor"],
    rows=[
        ["Executive Dashboard", "Full Access", "Full Access", "Treasury Only", "Projects Only", "Sales Only", "Read-Only"],
        ["Partner Capital Accounts", "Full Access", "Full Access", "View Only", "Hidden (403)", "Hidden (403)", "Read-Only"],
        ["Commercial Bank Balances", "Full Access", "Full Access", "Full Access", "Hidden (403)", "Hidden (403)", "Read-Only"],
        ["Land Acquisition & Dags", "Full Access", "Full Access", "View Only", "View Only", "Hidden (403)", "Read-Only"],
        ["Plot Asking Prices", "Full Access", "Full Access", "View Only", "View Only", "Full Access", "Read-Only"],
        ["Expense Voucher Entry", "Full Access", "Full Access", "Full Access", "Full Access", "Hidden (403)", "Read-Only"],
        ["Expense Approval Queue", "Full Access", "Full Access", "Review Only", "Hidden (403)", "Hidden (403)", "Read-Only"],
        ["Customer Installments", "Full Access", "Full Access", "Full Access", "Hidden (403)", "Full Access", "Read-Only"],
        ["Project Net P&L & Dividends", "Full Access", "Full Access", "Hidden (403)", "Hidden (403)", "Hidden (403)", "Read-Only"],
        ["User & Role Administration", "Full Access", "Hidden (403)", "Hidden (403)", "Hidden (403)", "Hidden (403)", "Hidden (403)"]
    ],
    notes=(
        "This table provides an overview of our default role boundary matrix. Notice the strict separation of duties. Your Sales Executive can view "
        "plots, customer dues, and collect installments, but land acquisition costs, bank balances, and net profit margins are completely hidden from "
        "them with an HTTP 403 Forbidden barrier. Your Site Manager can enter site expenses, but cannot approve them. Only the Owner has access to user "
        "administration and profit distribution."
    )
)

# Slide 54: Audit Trail
create_screenshot_slide(
    module_tag="Control & Governance",
    title="Immutable System-Wide Audit Trail",
    subtitle="Tamper-proof chronological log recording every create, edit, approval, and delete event.",
    image_filename="37_audit_trail.png",
    callouts=[
        ("Event Timestamp & User Attribution", "Exact date, time, user full name, and IP address for every single action taken in the system."),
        ("Action Type & Target Entity", "Clearly identifies whether an action was a CREATE, UPDATE, APPROVE, or DELETE on a specific record."),
        ("Detailed Before/After Change Diff", "Inspect exact data modifications (e.g., plot asking price changed from ৳ 14 Lakh to ৳ 15.75 Lakh).")
    ],
    notes=(
        "Here is the Immutable Audit Trail. Every single action taken in LandInvest is permanently recorded. If someone changes a plot's asking price, "
        "if an accountant approves a contra transfer, or if a site manager edits an expense, it is recorded here with the user's name, the timestamp, "
        "and the before-and-after change diff. This log is append-only—it cannot be edited or deleted by anyone, ensuring total accountability."
    )
)

# Slide 55: Multi-Tenant Data Safety
create_content_slide(
    module_tag="Control & Governance",
    title="Enterprise Multi-Tenant Data Isolation",
    subtitle="Your company's financial data is housed in a separate, isolated database—never mixed with competitors.",
    bullets_left=[
        ("Dedicated Tenant Database", "Unlike generic SaaS that dumps all customers into one shared table, LandInvest provisions a separate MySQL database (e.g., tenant_demo) for your firm."),
        ("Zero Cross-Company Leakage", "It is architecturally impossible for another company or competitor to see your land plots, partner lists, or bank transactions."),
        ("Encrypted Database Credentials", "All database passwords and connection strings are encrypted using AES-256 in the secure control plane."),
        ("Daily Automated Backups", "Full automated database dumps executed every 24 hours with local and off-site backup retention.")
    ],
    card_right_title="Data Ownership",
    card_right_body=[
        "🔒 100% Client Data Ownership: You own your data completely. If you ever decide to move, we provide a full SQL dump within 24 hours.",
        "🔒 No Vendor Lock-in: All data is structured in standard, industry-standard SQL tables that can be opened in any database tool.",
        "🔒 Strict Confidentiality: Our engineering staff cannot view your tenant database without your explicit written authorization."
    ],
    notes=(
        "Security is our highest priority. In LandInvest, your company data is housed in its own dedicated database. We never mix your land plots "
        "or bank accounts in the same database table with other developers. Your database credentials are encrypted with AES-256, automated backups "
        "run every 24 hours, and you retain 100% legal ownership of your data at all times. If you ever request your data, we hand you a complete "
        "SQL database file immediately."
    )
)

# ==============================================================================
# PART D: WORKING TOGETHER & IMPLEMENTATION
# ==============================================================================

# Slide 56: Part D Divider
create_section_divider(
    part_label="PART D — IMPLEMENTATION & PARTNERSHIP",
    section_title="Working Together: From Plan to Go-Live",
    summary_points=[
        "The complete lifecycle story of a single land plot from Bayna to dividend payout",
        "Deep localization: Bengali language, BDT Lakh/Crore formatting, July-June fiscal year",
        "Structured 4-week onboarding plan to migrate your data and train your staff",
        "Enterprise subscription plans, licensing tiers, and client support SLA"
    ],
    notes=(
        "We are now entering Part D: Working Together and Implementation. In this final section, we will walk through a real-life case study following "
        "a single land plot from its initial purchase to its final profit distribution. We will also cover our Bangladesh localization features, "
        "our 4-week structured onboarding plan, our pricing structure, and how we support your team after go-live."
    )
)

# Slide 57: Life of a Plot Walkthrough
create_workflow_slide(
    module_tag="Case Study Walkthrough",
    title="The Life of Plot RV-12: An End-to-End Story",
    subtitle="How a 4.00 Shotok parcel in River View Township generated ৳ 4.85 Lakh net profit for syndicate partners.",
    steps=[
        ("1", "Acquisition", "Md. Rafiqul Islam", "Purchase 220 Shotok in Rohitpur, Keraniganj at ৳ 1.27 L/Shotok. Record JL #88, RS-880, BS-1450.", "Plot RV-12 allocated 4.00 Shotok with land cost basis of ৳ 5.09 Lakh."),
        ("2", "Development", "Engr. Kamrul Hasan", "Execute site earthwork, sand filling, and boundary wall. Total approved capex: ৳ 1.60 L/Shotok.", "Cost basis for RV-12 increases to ৳ 10.90 Lakh (Land + Approved Capex)."),
        ("3", "Sale Agreement", "Tanvir Ahmed", "Buyer Golam Mustafa books RV-12 for ৳ 15.75 Lakh. 30% down payment (৳ 4.72 L) + 12 monthly installments.", "Contract created; Plot status changes to BOOKED; MR-0457 printed."),
        ("4", "Installment Dues", "Mahfuzur Rahman", "Collect monthly installments of ৳ 91,875 over 12 months. All receipts sequential in cash & bank books.", "Total collected reaches ৳ 15.75 Lakh; Plot status updates to SOLD."),
        ("5", "Dividend Credit", "LandInvest Engine", "Net realized profit of ৳ 4.85 Lakh unlocked and distributed: 40% to Partner A, 30% to Partner B, etc.", "Capital returned; dividends credited directly to partner capital ledgers.")
    ],
    notes=(
        "Let us follow the real-life story of Plot RV-12 in River View Township. First, the land was acquired at one point two seven lakh Taka per Shotok, "
        "giving RV-12 a land cost basis of five point zero nine lakh. Second, site earthwork and boundary walls added one point six lakh per Shotok in "
        "approved capex, bringing the total cost basis to ten point nine zero lakh. Third, buyer Golam Mustafa booked the plot for fifteen point seven "
        "five lakh Taka, paying thirty percent advance. Fourth, the accountant collected the remaining installments over twelve months with sequential "
        "money receipts. Finally, upon full collection, the net profit of four point eight five lakh Taka was unlocked and distributed to the syndicate "
        "partners. That is the complete LandInvest lifecycle."
    )
)

# Slide 58: Localization & Fiscal Years
create_screenshot_slide(
    module_tag="Bangladesh Localization",
    title="Fiscal Year Configuration (July - June)",
    subtitle="Configured natively for Bangladesh corporate tax cycles and reporting requirements.",
    image_filename="40_settings_fiscal_years.png",
    callouts=[
        ("Active Fiscal Year Indicator", "Displays active fiscal period (July 1, 2026 to June 30, 2027) with days remaining in period."),
        ("Quarterly Tax Milestones", "Quarterly closing dates aligned with NBR advance corporate income tax filing deadlines."),
        ("Historical Fiscal Archive", "Lock closed fiscal periods to prevent historical tampering while keeping audited records fully readable.")
    ],
    notes=(
        "Here is the Fiscal Year configuration screen. In Bangladesh, businesses operate on a July 1st to June 30th financial year. LandInvest is "
        "pre-configured for this exact cycle. Callout one shows your active fiscal year. Callout two tracks your quarterly milestones for NBR advance "
        "tax planning. Callout three allows you to lock closed fiscal years so that no historical transactions can be accidentally altered once your "
        "annual tax return has been submitted."
    )
)

# Slide 59: Onboarding Plan
create_workflow_slide(
    module_tag="Implementation Roadmap",
    title="Structured 4-Week Client Onboarding Plan",
    subtitle="A proven rollout methodology ensuring zero business disruption and complete team adoption.",
    steps=[
        ("W1", "Data Discovery", "Implementation Team", "Collect master project deeds, partner capital records, active plot inventories, and bank account balances.", "Clean master onboarding spreadsheet prepared and verified."),
        ("W2", "Environment Setup", "Technical Lead", "Provision dedicated tenant database, configure corporate branding, bank accounts, and custom user roles.", "Secure cloud environment operational with test data."),
        ("W3", "Historical Opening Import", "Senior Accountant", "Import opening partner capital balances, active customer installment schedules, and cash in hand.", "Opening balances verified against previous paper registers."),
        ("W4", "Team Training & Go-Live", "All Users & Staff", "Conduct role-specific hands-on workshops for Site Managers, Sales Staff, and Accountants. Cut over to live system.", "System officially live; ongoing priority telephone support begins.")
    ],
    notes=(
        "How do we get started? We use a structured 4-week onboarding plan. In Week 1, our implementation specialists help you gather your existing "
        "records: partner capital, bank balances, and plot inventories. In Week 2, we provision your dedicated database and configure your custom "
        "roles. In Week 3, we import your opening balances and verify them against your bank statements. In Week 4, we train your site managers, "
        "accountants, and sales staff, and go live. Timings are marked as [TO BE CONFIRMED] based on your team's availability."
    )
)

# Slide 60: Plans & Billing
create_screenshot_slide(
    module_tag="Pricing & Licensing",
    title="Subscription & Enterprise Licensing",
    subtitle="Transparent, predictable pricing based on active projects and team members.",
    image_filename="41_settings_billing.png",
    callouts=[
        ("Enterprise Subscription Status", "Active Enterprise license with annual billing cycle, verified payment status, and invoice history."),
        ("Tiered Plan Capacity Limits", "Basic Plan (5 users, 10 projects) vs Pro Plan (15 users, 50 projects) vs Enterprise (Unlimited)."),
        ("Downloadable Tax Invoices", "Access formal corporate VAT invoices and renewal notices directly from the application portal.")
    ],
    notes=(
        "Here is the Subscription and Billing screen. Our pricing model is straightforward, transparent, and scalable. We offer Basic, Pro, and "
        "Enterprise tiers based on the number of active projects and users your business requires. Our exact pricing will be tailored to your "
        "project volume and is marked as [PRICING TO BE ADDED] in our proposal document. All subscriptions include software updates, daily automated "
        "backups, and dedicated telephone support."
    )
)

# Slide 61: Next Steps & Contact
create_content_slide(
    module_tag="Next Steps",
    title="Taking the Next Step Together",
    subtitle="Let us help you bring institutional transparency and control to your land partnership.",
    bullets_left=[
        ("1. Schedule a Hands-on Demo", "We invite your managing partners and senior accountant to test their own sample project data in an interactive staging sandbox."),
        ("2. Data Readiness Assessment", "Our business analysts will review your current paper registers and Excel sheets to map out your migration timeline."),
        ("3. Tailored Enterprise Proposal", "Receive a customized pricing and onboarding schedule tailored specifically to [CLIENT NAME]'s active projects."),
        ("4. Pilot Project Launch", "Start with a single active land development project to experience the speed and clarity of LandInvest before full rollout.")
    ],
    card_right_title="Contact Information",
    card_right_body=[
        "🏢 Company: LandInvest Technologies Ltd.",
        "📍 Address: Dhaka, Bangladesh [CONTACT DETAILS]",
        "📞 Telephone: [CONTACT DETAILS]",
        "✉ Email: [CONTACT DETAILS]",
        "🌐 Web: www.landinvest.test [CONTACT DETAILS]",
        "",
        "Thank you for your time and consideration. We look forward to partnering with [CLIENT NAME]!"
    ],
    notes=(
        "Thank you very much for your time and attention today. To take the next step, we invite you and your partners to a hands-on workshop where "
        "you can enter sample data from your own projects and see how effortless the system is. We will provide a tailored proposal for [CLIENT NAME] "
        "with complete pricing details. All contact details are provided here. We are now open for any questions you may have."
    )
)

# ==============================================================================
# APPENDIX
# ==============================================================================

# Slide 62: Appendix Divider
create_section_divider(
    part_label="APPENDIX",
    section_title="Reference Gallery, Glossary & Technical FAQ",
    summary_points=[
        "Complete visual index of all 42 application screen captures",
        "Comprehensive glossary of Bengali land survey and partnership accounting terms",
        "Client Frequently Asked Questions regarding data security, backups, and exports"
    ],
    notes=(
        "In the appendix, we have compiled supplementary reference materials for your executive team: a visual thumbnail gallery of all 42 captured "
        "application screens, an authoritative glossary of Bengali land and accounting terminology, and answers to the most frequent technical "
        "and data ownership questions asked by real estate business owners."
    )
)

# Slide 63: Glossary Slide
create_table_slide(
    module_tag="Appendix — Glossary",
    title="Glossary of Bengali Land & Accounting Terms",
    subtitle="Plain-language definitions of key survey, legal, and partnership accounting concepts.",
    headers=["Term (বাংলা / English)", "Domain", "Official Legal & Business Meaning in LandInvest"],
    rows=[
        ["Bayna (বায়না)", "Acquisition", "Initial formal agreement advance paid to the land seller to secure purchase rights before sub-registry."],
        ["Mouza & JL (মৌজা ও জেএল)", "Survey", "Revenue village boundary and official Jurisdiction List number identifying the land's cadastral location."],
        ["Dag Number (দাগ নম্বর)", "Survey", "Specific plot parcel number in government surveys: CS (1888), SA (1956), RS (1972), BS/City (Current)."],
        ["Khatian / Porcha (খতিয়ান)", "Title", "Record of Rights (ROR) document establishing government ownership history, tenant rights, and area."],
        ["Shotok / Decimal (শতক)", "Measurement", "Standard unit of land area in Bangladesh. 1 Shotok = 435.6 sq ft. 1 Katha = 1.65 Shotok. 1 Bigha = 33 Shotok."],
        ["Namjari / Mutation (নামজারি)", "Revenue", "Official process of updating the government land revenue record from previous owner to new buyer."],
        ["Khajna / Tax (খাজনা)", "Revenue", "Annual land development tax paid to the Bangladesh government Union Land Office."],
        ["Contra Transfer (কন্ট্রা)", "Treasury", "Double-entry fund transfer moving money between company cash drawer and commercial bank accounts."],
        ["Money Receipt / MR (মানি রিসিট)", "Sales", "Sequential legal receipt issued to plot buyers acknowledging installment payment with words in Taka."]
    ],
    notes=(
        "This glossary is a valuable reference for your team and prospective investors. It clearly defines every traditional Bangladeshi land term "
        "used in the software—from Bayna and Khatian to Shotok, Katha, and Contra transfers. It bridges the gap between traditional Amin survey "
        "practices and modern corporate accounting."
    )
)

# Slide 64: Client FAQ Slide
create_content_slide(
    module_tag="Appendix — FAQ",
    title="Frequently Asked Questions (FAQ) for Clients",
    subtitle="Clear answers to the most common questions asked by prospective land business owners.",
    bullets_left=[
        ("Q: Who owns our data, and can we export it?", "A: You own 100% of your data. You can export complete Excel spreadsheets or request a full MySQL database dump at any time without fees or lock-in."),
        ("Q: What happens if our internet connection drops at the site?", "A: The system requires standard internet connectivity. Site managers can capture voucher photos offline on their phones and submit them the moment they return to mobile data coverage."),
        ("Q: Can our sales staff see land purchase costs or partner profit?", "A: Absolutely not. Role-Based Access Control completely isolates sales executives from costs, bank balances, and profit ledgers (HTTP 403 Forbidden)."),
        ("Q: How are automated backups handled?", "A: Full database backups run automatically every 24 hours. Backups are encrypted and stored in redundant off-site data centers with 30-day historical retention.")
    ],
    card_right_title="Security Highlights",
    card_right_body=[
        "🛡 Dedicated Database Isolation (Multi-Tenant)",
        "🛡 SSL / TLS 256-Bit Encrypted Data in Transit",
        "🛡 AES-256 Encrypted Database Passwords",
        "🛡 Immutable, Tamper-Proof Audit Logging",
        "🛡 99.9% Uptime Guarantee on Enterprise Tiers",
        "",
        "For additional technical inquiries, contact our engineering support team at [CONTACT DETAILS]."
    ],
    notes=(
        "Finally, our client FAQ addresses the four most common questions we hear from business owners: data ownership, offline handling, role "
        "security, and backup procedures. As emphasized here, you own your data 100%, your sales team can never see your cost margins, and daily "
        "automated backups ensure your business records are safe forever. Thank you once again for your interest in LandInvest."
    )
)

# ==============================================================================
# SAVE PRESENTATION (WITH TIMESTAMPED BACKUP IF EXISTING)
# ==============================================================================
import datetime
import shutil

if os.path.exists(OUTPUT_PPTX):
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_name = f"LandInvest_Client_Presentation_backup_{timestamp}.pptx"
    backup_path = os.path.join(os.path.dirname(OUTPUT_PPTX), backup_name)
    try:
        shutil.copy2(OUTPUT_PPTX, backup_path)
        print(f"[BACKUP] Existing presentation backed up to: {backup_path}")
    except Exception as e:
        print(f"[WARN] Could not create backup: {e}")

prs.save(OUTPUT_PPTX)
print(f"\n==================================================================")
print(f"SUCCESS! Presentation generated successfully with {current_slide_num} slides.")
print(f"Saved to: {OUTPUT_PPTX}")
print(f"==================================================================")
