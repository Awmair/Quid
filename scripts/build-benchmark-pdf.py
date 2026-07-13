#!/usr/bin/env python3
"""Build the four-page Quid 2026 senior living benchmark brief."""

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus import (
    Flowable,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public/downloads/quid-senior-living-inquiry-to-tour-benchmark-2026.pdf"

INK = colors.HexColor("#163B32")
INK_DARK = colors.HexColor("#102E28")
MINT = colors.HexColor("#CDEFE3")
MINT_LIGHT = colors.HexColor("#EAF8F3")
CORAL = colors.HexColor("#F17C62")
CREAM = colors.HexColor("#FBF8F1")
GOLD = colors.HexColor("#F3C96A")
TEXT = colors.HexColor("#233A34")
MUTED = colors.HexColor("#5B6D68")
LINE = colors.HexColor("#D9E4DF")
WHITE = colors.white


def register_fonts():
    candidates = [
        ("DejaVuSans", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
        ("DejaVuSans-Bold", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"),
    ]
    for name, path in candidates:
        if Path(path).exists():
            pdfmetrics.registerFont(TTFont(name, path))
    return (
        "DejaVuSans" if "DejaVuSans" in pdfmetrics.getRegisteredFontNames() else "Helvetica",
        "DejaVuSans-Bold" if "DejaVuSans-Bold" in pdfmetrics.getRegisteredFontNames() else "Helvetica-Bold",
    )


REGULAR, BOLD = register_fonts()


class StatCard(Flowable):
    def __init__(self, value, label, width=1.45 * inch, height=1.06 * inch, accent=False):
        super().__init__()
        self.width = width
        self.height = height
        self.value = value
        self.label = label
        self.accent = accent

    def draw(self):
        canvas = self.canv
        fill = CORAL if self.accent else MINT_LIGHT
        value_color = WHITE if self.accent else INK
        label_color = WHITE if self.accent else TEXT
        canvas.setFillColor(fill)
        canvas.roundRect(0, 0, self.width, self.height, 12, fill=1, stroke=0)
        canvas.setFillColor(value_color)
        canvas.setFont(BOLD, 24)
        canvas.drawCentredString(self.width / 2, self.height - 31, self.value)
        canvas.setFillColor(label_color)
        canvas.setFont(REGULAR, 7.4)
        lines = self.label.split("|")
        y = 18 + (len(lines) - 1) * 4
        for line in lines:
            canvas.drawCentredString(self.width / 2, y, line)
            y -= 10


class BarChart(Flowable):
    def __init__(self, rows, width=6.45 * inch, height=2.35 * inch):
        super().__init__()
        self.width = width
        self.height = height
        self.rows = rows

    def draw(self):
        c = self.canv
        label_w = 2.6 * inch
        bar_w = self.width - label_w - 0.35 * inch
        start_y = self.height - 0.42 * inch
        row_h = 0.64 * inch
        for idx, (label, value, fill) in enumerate(self.rows):
            y = start_y - idx * row_h
            c.setFillColor(TEXT)
            c.setFont(BOLD, 9)
            c.drawString(0, y + 9, label)
            c.setFillColor(colors.HexColor("#EEF2F0"))
            c.roundRect(label_w, y, bar_w, 0.30 * inch, 7, fill=1, stroke=0)
            c.setFillColor(fill)
            c.roundRect(label_w, y, bar_w * value / 100, 0.30 * inch, 7, fill=1, stroke=0)
            c.setFillColor(INK_DARK)
            c.setFont(BOLD, 10)
            c.drawRightString(self.width, y + 7, f"{value}%")


class SignalBars(Flowable):
    def __init__(self, width=6.45 * inch, height=2.0 * inch):
        super().__init__()
        self.width = width
        self.height = height

    def draw(self):
        c = self.canv
        rows = [
            ("Manual or delayed signal", 62, CORAL),
            ("Visible automation signal", 47, INK),
            ("Both signals", 14, GOLD),
        ]
        max_w = 4.0 * inch
        for idx, (label, value, fill) in enumerate(rows):
            y = self.height - 0.52 * inch - idx * 0.56 * inch
            c.setFillColor(TEXT)
            c.setFont(BOLD, 8.8)
            c.drawString(0, y + 8, label)
            c.setFillColor(colors.HexColor("#EEF2F0"))
            c.roundRect(2.05 * inch, y, max_w, 0.28 * inch, 6, fill=1, stroke=0)
            c.setFillColor(fill)
            c.roundRect(2.05 * inch, y, max_w * value / 100, 0.28 * inch, 6, fill=1, stroke=0)
            c.setFillColor(INK_DARK)
            c.setFont(BOLD, 10)
            c.drawRightString(self.width, y + 6.5, str(value))


def page_frame(canvas, doc):
    canvas.saveState()
    w, h = letter
    canvas.setFillColor(CREAM)
    canvas.rect(0, 0, w, h, fill=1, stroke=0)
    canvas.setFillColor(INK_DARK)
    canvas.rect(0, h - 0.18 * inch, w, 0.18 * inch, fill=1, stroke=0)
    canvas.setStrokeColor(LINE)
    canvas.line(0.62 * inch, 0.48 * inch, w - 0.62 * inch, 0.48 * inch)
    canvas.setFillColor(MUTED)
    canvas.setFont(REGULAR, 7.5)
    canvas.drawString(0.62 * inch, 0.27 * inch, "Quid Research | July 2026")
    canvas.drawRightString(w - 0.62 * inch, 0.27 * inch, f"{doc.page} / 4")
    canvas.restoreState()


styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="Eyebrow", fontName=BOLD, fontSize=8, leading=10, textColor=CORAL, spaceAfter=8, tracking=1.2))
styles.add(ParagraphStyle(name="Hero", fontName=BOLD, fontSize=26, leading=30, textColor=INK_DARK, spaceAfter=13))
styles.add(ParagraphStyle(name="Deck", fontName=REGULAR, fontSize=11, leading=16, textColor=TEXT, spaceAfter=13))
styles.add(ParagraphStyle(name="Section", fontName=BOLD, fontSize=17, leading=21, textColor=INK_DARK, spaceBefore=6, spaceAfter=9))
styles.add(ParagraphStyle(name="Subsection", fontName=BOLD, fontSize=11, leading=14, textColor=INK, spaceBefore=4, spaceAfter=5))
styles.add(ParagraphStyle(name="BodyQ", fontName=REGULAR, fontSize=9.1, leading=13.2, textColor=TEXT, spaceAfter=7))
styles.add(ParagraphStyle(name="SmallQ", fontName=REGULAR, fontSize=7.8, leading=10.5, textColor=MUTED, spaceAfter=5))
styles.add(ParagraphStyle(name="QuoteQ", fontName=BOLD, fontSize=14, leading=19, textColor=INK_DARK, alignment=TA_LEFT))
styles.add(ParagraphStyle(name="CardTitle", fontName=BOLD, fontSize=9.1, leading=11, textColor=INK_DARK, spaceAfter=3))
styles.add(ParagraphStyle(name="CardTitleWhite", fontName=BOLD, fontSize=8.3, leading=10, textColor=WHITE))
styles.add(ParagraphStyle(name="CardBody", fontName=REGULAR, fontSize=7.6, leading=10.2, textColor=TEXT))
styles.add(ParagraphStyle(name="CenterSmall", fontName=REGULAR, fontSize=7.8, leading=10.5, textColor=MUTED, alignment=TA_CENTER))
styles.add(ParagraphStyle(name="LinkQ", fontName=BOLD, fontSize=8.5, leading=12, textColor=INK))


def P(text, style="BodyQ"):
    return Paragraph(text, styles[style])


def build_pdf():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=letter,
        rightMargin=0.72 * inch,
        leftMargin=0.72 * inch,
        topMargin=0.58 * inch,
        bottomMargin=0.68 * inch,
        title="2026 Senior Living Inquiry-to-Tour Benchmark: 100 Communities",
        author="Quid Research",
        subject="Original research on 100 public senior living inquiry-to-tour journeys",
    )
    story = []

    # Page 1: cover and answer.
    story += [
        Spacer(1, 0.15 * inch),
        P("QUID 2026 BENCHMARK", "Eyebrow"),
        P("What happens after<br/>a senior living tour CTA?", "Hero"),
        P("A transparent review of 100 public community website journeys across 28 operator groups and 23 US states.", "Deck"),
    ]
    stat_row = [[
        StatCard("100", "community pages|reviewed"),
        StatCard("28", "operator groups|represented"),
        StatCard("23", "US states|represented"),
        StatCard("62%", "manual or delayed|signal", accent=True),
    ]]
    stats = Table(stat_row, colWidths=[1.53 * inch] * 4, hAlign="LEFT")
    stats.setStyle(TableStyle([("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 6)]))
    story += [stats, Spacer(1, 0.28 * inch)]
    quote = Table([[P("62 of 100 reviewed senior living pages exposed a manual or delayed step somewhere in the public inquiry-to-tour journey.", "QuoteQ")]], colWidths=[6.35 * inch])
    quote.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), MINT),
        ("BOX", (0, 0), (-1, -1), 0, MINT),
        ("LEFTPADDING", (0, 0), (-1, -1), 17),
        ("RIGHTPADDING", (0, 0), (-1, -1), 17),
        ("TOPPADDING", (0, 0), (-1, -1), 15),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 15),
    ]))
    story += [quote, Spacer(1, 0.18 * inch)]
    story += [
        P("The direct answer", "Section"),
        P("A tour button does not reveal whether the visitor is booking a confirmed visit or beginning another round of coordination. In this purposive benchmark, 62 pages exposed a form, preferred-time request, staff-arranged step, or other visible pause. Forty-seven pages exposed an automation signal. Fourteen exposed both."),
        P("The practical question is not whether a page has a form or a chatbot. It is whether the full journey gives a family a clear next step while giving staff ownership, safe handoffs, and visibility into what is stuck."),
        P("Important: this is a targeted, operator-clustered website benchmark, not a randomized estimate of all US senior living communities.", "SmallQ"),
    ]

    # Page 2: cohort comparison.
    story += [PageBreak(), P("COHORT COMPARISON", "Eyebrow"), P("Small operators show more visible coordination friction", "Section")]
    story += [
        P("The 25-page independent and small-operator cohort exposed more forms and staff-arranged steps. The 75-page multi-location expansion exposed substantially more embedded automation. The cohorts should be read separately because pages from the same operator may share technology and design."),
        BarChart([
            ("Small-operator cohort: manual/delayed", 80, CORAL),
            ("Multi-location cohort: manual/delayed", 56, CORAL),
            ("Small-operator cohort: automation", 4, INK),
            ("Multi-location cohort: automation", 61, INK),
        ]),
        P("Percent of reviewed pages. Signals are not mutually exclusive.", "CenterSmall"),
        Spacer(1, 0.08 * inch),
    ]
    cohort_data = [
        [P("Cohort", "CardTitleWhite"), P("Pages", "CardTitleWhite"), P("Manual / delayed", "CardTitleWhite"), P("Automation", "CardTitleWhite")],
        [P("Independent and small operator", "CardBody"), "25", "20 / 80%", "1 / 4%"],
        [P("Multi-location template expansion", "CardBody"), "75", "42 / 56%", "46 / 61%"],
        [P("Combined benchmark", "CardBody"), "100", "62 / 62%", "47 / 47%"],
    ]
    cohort_table = Table(cohort_data, colWidths=[2.8 * inch, 0.65 * inch, 1.45 * inch, 1.25 * inch], repeatRows=1)
    cohort_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), INK_DARK),
        ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("FONTNAME", (0, 1), (-1, -1), REGULAR),
        ("FONTSIZE", (1, 1), (-1, -1), 8.5),
        ("TEXTCOLOR", (0, 1), (-1, -1), TEXT),
        ("BACKGROUND", (0, 1), (-1, 1), WHITE),
        ("BACKGROUND", (0, 2), (-1, 2), MINT_LIGHT),
        ("BACKGROUND", (0, 3), (-1, 3), WHITE),
        ("GRID", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    story += [cohort_table, Spacer(1, 0.2 * inch), P("What the contrast suggests", "Subsection"), P("Larger templates more often expose automation, but visible staff follow-up and preferred-time requests remain common. Automation presence alone does not prove a confirmed tour, complete integration, or better conversion. The useful audit unit is the whole journey, not the widget.")]

    # Page 3: patterns and implications.
    story += [PageBreak(), P("VISIBLE JOURNEY SIGNALS", "Eyebrow"), P("The same CTA can lead to five different journeys", "Section")]
    story += [SignalBars(), P("Counts across 100 reviewed pages. Fourteen pages exposed both signal types.", "CenterSmall"), Spacer(1, 0.06 * inch)]
    patterns = [
        ("01", "Form and staff-arranged", "The visitor provides information; a person or team handles the next step later."),
        ("02", "Time requested, not reserved", "The page accepts a preferred date or time without visibly confirming a booking."),
        ("03", "Embedded inquiry assistant", "An automated assistant is exposed and can continue the conversation."),
        ("04", "Automation plus staff follow-up", "An assistant is present, while the page still promises later staff contact."),
        ("05", "Immediate scheduling visible", "Availability, supported selection, and confirmation are clear to the visitor."),
    ]
    pattern_rows = []
    for number, title, body in patterns:
        pattern_rows.append([
            P(f"<font color='#F17C62'><b>{number}</b></font>", "CardTitle"),
            P(title, "CardTitle"),
            P(body, "CardBody"),
        ])
    pattern_table = Table(pattern_rows, colWidths=[0.43 * inch, 2.05 * inch, 3.85 * inch])
    pattern_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), WHITE),
        ("BOX", (0, 0), (-1, -1), 0.6, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.4, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    story += [pattern_table, Spacer(1, 0.18 * inch)]
    revenue = Table([[P("THE REVENUE PROBLEM", "Eyebrow"), P("Families may contact more than one community. Every unnecessary pause between inquiry and a clear next step gives another community an opening.", "QuoteQ")]], colWidths=[1.55 * inch, 4.75 * inch])
    revenue.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), MINT),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 13),
        ("RIGHTPADDING", (0, 0), (-1, -1), 13),
        ("TOPPADDING", (0, 0), (-1, -1), 12),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
    ]))
    story += [revenue, Spacer(1, 0.12 * inch), P("A controlled fix should acknowledge the request, expose only approved availability, confirm the visit, notify the staff owner, pause for sensitive questions, and show managers what is still stuck.")]

    # Page 4: methodology, limits and citation.
    story += [PageBreak(), P("HOW TO USE THIS RESEARCH", "Eyebrow"), P("Transparent enough to verify; restrained enough to trust", "Section")]
    method_data = [
        [P("25-page initial cohort", "CardTitle"), P("Independent and small-operator pages evaluated July 12-13, 2026. Public rows remain anonymized to separate research from outreach identities.", "CardBody")],
        [P("75-page expansion", "CardTitle"), P("Fifteen public community pages from each of five operator clusters: Brookdale, Sunrise Senior Living, Benchmark Senior Living, Merrill Gardens, and Leisure Care.", "CardBody")],
        [P("Review protocol", "CardTitle"), P("One public page per row. No form submission, impersonation, response-time test, private-system access, or resident or medical information.", "CardBody")],
        [P("Evidence recorded", "CardTitle"), P("CTA category, visible journey category, manual or delayed signal, automation signal, state, operator-size band, and review date.", "CardBody")],
    ]
    method_table = Table(method_data, colWidths=[1.55 * inch, 4.78 * inch])
    method_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), WHITE),
        ("BOX", (0, 0), (-1, -1), 0.6, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.4, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 9),
        ("RIGHTPADDING", (0, 0), (-1, -1), 9),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    story += [method_table, Spacer(1, 0.16 * inch), P("Limitations", "Subsection"), P("This is a purposive, operator-clustered sample. It must not be cited as the share of all US communities. Public HTML can expose scripts and language but cannot prove response speed, implementation quality, availability, integrations, conversion, occupancy, revenue, or clinical performance.")]
    citation = Table([[P("SUGGESTED CITATION", "Eyebrow"), P('Quid Research. "2026 Senior Living Inquiry-to-Tour Benchmark: 100 Communities." Quid Admissions, July 14, 2026.', "CardBody")]], colWidths=[1.45 * inch, 4.9 * inch])
    citation.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), MINT_LIGHT),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 11),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 11),
    ]))
    story += [citation, Spacer(1, 0.14 * inch)]
    story += [
        P('<link href="https://get-quid.site/resources/senior-living-inquiry-to-tour-audit/">Read the full methodology and download the data</link>', "LinkQ"),
        P('<link href="https://get-quid.site/data/senior-living-inquiry-to-tour-audit-2026.csv">100-row anonymized dataset</link> &nbsp;&nbsp; | &nbsp;&nbsp; <link href="https://get-quid.site/data/senior-living-inquiry-to-tour-benchmark-sources-2026.csv">75-page named source register</link>', "SmallQ"),
        Spacer(1, 0.04 * inch),
        P("Media and interviews: Umair Q., Founder, Quid Admissions", "Subsection"),
        P('<link href="https://www.linkedin.com/in/umair-qudoos/">linkedin.com/in/umair-qudoos</link> &nbsp;&nbsp; | &nbsp;&nbsp; <link href="https://get-quid.site/about/">get-quid.site/about/</link>', "SmallQ"),
    ]

    doc.build(story, onFirstPage=page_frame, onLaterPages=page_frame)


if __name__ == "__main__":
    build_pdf()
    print(OUTPUT)
