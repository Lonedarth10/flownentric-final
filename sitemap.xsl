
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9">

  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>NENTRIC | XML Sitemap</title>
        <style>
          :root {
            color-scheme: light;
            --onyx: #171717;
            --bone: #F7F4ED;
            --sunfire: #F05A28;
            --muted: #77736D;
            --line: #E5E0D6;
            --white: #FFFFFF;
          }

          * { box-sizing: border-box; }

          body {
            margin: 0;
            background: var(--bone);
            color: var(--onyx);
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.5;
          }

          .topbar {
            height: 5px;
            background: var(--sunfire);
          }

          main {
            width: min(900px, calc(100% - 40px));
            margin: 64px auto;
          }

          .brand {
            font-size: 13px;
            font-weight: 800;
            letter-spacing: 3px;
          }

          .brand span { color: var(--sunfire); }

          .eyebrow {
            margin-top: 56px;
            color: var(--muted);
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 2px;
            text-transform: uppercase;
          }

          h1 {
            margin: 10px 0 12px;
            font-size: clamp(34px, 6vw, 54px);
            line-height: 1.05;
            letter-spacing: -2px;
          }

          .intro {
            max-width: 580px;
            color: var(--muted);
            font-size: 15px;
          }

          .summary {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            margin: 32px 0 12px;
            padding: 18px 20px;
            background: var(--onyx);
            color: var(--white);
            border-radius: 8px;
          }

          .summary-label {
            font-size: 12px;
            color: #D0CCC4;
          }

          .count {
            font-size: 24px;
            font-weight: 700;
          }

          .count small {
            font-size: 12px;
            font-weight: 400;
            color: #D0CCC4;
          }

          .table-wrap {
            overflow: hidden;
            background: var(--white);
            border: 1px solid var(--line);
            border-radius: 8px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
          }

          th {
            padding: 14px 20px;
            background: #F0ECE4;
            color: var(--muted);
            font-size: 10px;
            letter-spacing: 1.4px;
            text-transform: uppercase;
          }

          td {
            padding: 17px 20px;
            border-top: 1px solid var(--line);
            font-size: 13px;
            overflow-wrap: anywhere;
          }

          .number {
            width: 60px;
            color: var(--muted);
          }

          a {
            color: var(--onyx);
            text-decoration: none;
          }

          a:hover {
            color: var(--sunfire);
            text-decoration: underline;
          }

          .status {
            color: #287443;
            font-size: 11px;
            font-weight: 700;
          }

          footer {
            margin-top: 28px;
            padding-top: 18px;
            border-top: 1px solid var(--line);
            color: var(--muted);
            font-size: 11px;
          }

          footer strong {
            color: var(--onyx);
            letter-spacing: 1px;
          }

          @media (max-width: 560px) {
            main { margin: 36px auto; }
            .eyebrow { margin-top: 40px; }
            th, td { padding: 13px 10px; }
            .number { width: 36px; }
            .status { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="topbar"></div>
        <main>
          <div class="brand">NENTRIC<span>.</span></div>

          <div class="eyebrow">Site infrastructure / 001</div>
          <h1>XML Sitemap</h1>
          <p class="intro">
            An index of publicly accessible pages on nentric.com,
            provided to help search engines discover the website.
          </p>

          <div class="summary">
            <div>
              <div class="summary-label">WEBSITE DIRECTORY</div>
              <div>nentric.com</div>
            </div>
            <div class="count">
              <xsl:value-of select="count(/sm:urlset/sm:url)"/>
              <small> URLs</small>
            </div>
          </div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th class="number">No.</th>
                  <th>Page URL</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="/sm:urlset/sm:url">
                  <tr>
                    <td class="number">
                      <xsl:value-of select="position()"/>
                    </td>
                    <td>
                      <a>
                        <xsl:attribute name="href">
                          <xsl:value-of select="sm:loc"/>
                        </xsl:attribute>
                        <xsl:value-of select="sm:loc"/>
                      </a>
                    </td>
                    <td class="status">Listed</td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>

          <footer>
            <strong>NENTRIC</strong>
            <span> / WE BUILD WHAT MOVES.</span>
            <p>This directory is generated from the XML sitemap.
              Listing a URL does not guarantee that it is indexed.</p>
          </footer>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
