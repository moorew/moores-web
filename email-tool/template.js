/* ============================================================
   Moores Home & Garden — email template engine
   buildEmailHTML(data, srcs) -> full EmailOctopus-ready HTML string
   Keep all brand styling here so the form can never break it.
   ============================================================ */
(function () {
  "use strict";

  // HTML-escape every value the user types so nothing can break the markup.
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  // Headline allows line breaks: newline -> <br>
  function nl2br(s) { return esc(s).replace(/\r?\n/g, "<br>"); }

  var BODY_P = "font-family:'Jost',Helvetica,Arial,sans-serif; font-weight:300; font-size:16px; line-height:1.75; color:#2A211A;";

  function bodyParagraphs(list) {
    var items = (list || []).filter(function (t) { return String(t).trim() !== ""; });
    var out = "";
    // Greeting line is fixed so the personalisation merge tag can never be deleted.
    out += '<p style="margin:0 0 18px; ' + BODY_P + '">Hello {{FirstName|default("there")}},</p>\n';
    items.forEach(function (t, i) {
      var last = i === items.length - 1;
      out += '              <p style="margin:0' + (last ? "" : " 0 18px") + '; ' + BODY_P + '">' + esc(t) + "</p>\n";
    });
    return out;
  }

  window.buildEmailHTML = function (data, srcs) {
    srcs = srcs || {};
    var hero = srcs.hero || data.heroSrc;
    var feature = srcs.feature || data.featureSrc;
    var flame = srcs.flame || "https://mooreshomeandgarden.com/email/flame-divider.png";
    var logoHeader = "https://mooreshomeandgarden.com/email/logo-header.png";
    var logoFooter = "https://mooreshomeandgarden.com/email/logo-footer.png";

    return '<!DOCTYPE html>\n' +
'<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">\n' +
'<head>\n' +
'<meta charset="utf-8">\n' +
'<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
'<meta http-equiv="X-UA-Compatible" content="IE=edge">\n' +
'<meta name="x-apple-disable-message-reformatting">\n' +
'<meta name="color-scheme" content="light only">\n' +
'<meta name="supported-color-schemes" content="light only">\n' +
'<title>' + esc(data.subject || "Moores Home & Garden") + '</title>\n' +
'<!--[if mso]>\n' +
'<noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>\n' +
'<![endif]-->\n' +
'<link rel="preconnect" href="https://fonts.googleapis.com">\n' +
'<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">\n' +
'<style>\n' +
'  body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }\n' +
'  table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; }\n' +
'  img { -ms-interpolation-mode:bicubic; border:0; height:auto; line-height:100%; outline:none; text-decoration:none; }\n' +
'  table { border-collapse:collapse !important; }\n' +
'  body { margin:0 !important; padding:0 !important; width:100% !important; height:100% !important; }\n' +
'  a { text-decoration:none; }\n' +
'  a[x-apple-data-detectors] { color:inherit !important; text-decoration:none !important; font-size:inherit !important; font-family:inherit !important; font-weight:inherit !important; line-height:inherit !important; }\n' +
'  .hover-cta:hover { background:#90492A !important; }\n' +
'  .hover-link:hover { color:#90492A !important; }\n' +
'  @media only screen and (max-width:620px) {\n' +
'    .full     { width:100% !important; }\n' +
'    .px       { padding-left:26px !important; padding-right:26px !important; }\n' +
'    .h1       { font-size:34px !important; line-height:1.08 !important; }\n' +
'    .lead     { font-size:19px !important; }\n' +
'    .feat-img { width:100% !important; height:auto !important; }\n' +
'    .feat-pad { padding:26px 26px 4px !important; }\n' +
'    .hero-pad { padding:30px 26px 0 !important; }\n' +
'  }\n' +
'</style>\n' +
'</head>\n' +
'<body style="margin:0; padding:0; background-color:#E7DDCA;">\n' +
'  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:#E7DDCA; opacity:0;">\n' +
'    ' + esc(data.preheader) + '&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;\n' +
'  </div>\n' +
'  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#E7DDCA;">\n' +
'    <tr>\n' +
'      <td align="center" style="padding:28px 12px 40px;">\n' +
'        <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->\n' +
'        <table role="presentation" width="600" class="full" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px; background-color:#F6F0E5;">\n' +
'          <tr>\n' +
'            <td align="center" style="padding:34px 40px 26px;">\n' +
'              <a href="' + esc(data.ctaUrl || "https://mooreshomeandgarden.com") + '" target="_blank" style="text-decoration:none;">\n' +
'                <img src="' + esc(logoHeader) + '" width="216" alt="Moores Home &amp; Garden" style="display:block; width:216px; max-width:62%; height:auto;">\n' +
'              </a>\n' +
'            </td>\n' +
'          </tr>\n' +
'          <tr>\n' +
'            <td style="padding:0 40px;">\n' +
'              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>\n' +
'                <td style="height:1px; background-color:#D9CCB7; line-height:1px; font-size:1px;">&nbsp;</td>\n' +
'              </tr></table>\n' +
'            </td>\n' +
'          </tr>\n' +
'          <tr>\n' +
'            <td style="padding:0;">\n' +
'              <img src="' + esc(hero) + '" width="600" alt="' + esc(data.heroAlt || "Moores Home & Garden") + '" class="full feat-img" style="display:block; width:100%; max-width:600px; height:auto;">\n' +
'            </td>\n' +
'          </tr>\n' +
'          <tr>\n' +
'            <td align="center" class="hero-pad px" style="padding:42px 56px 0;">\n' +
'              <p style="margin:0 0 18px; font-family:\'Jost\',Helvetica,Arial,sans-serif; font-weight:400; font-size:12px; letter-spacing:4px; text-transform:uppercase; color:#B05E36;">' + esc(data.eyebrow) + '</p>\n' +
'              <h1 class="h1" style="margin:0; font-family:\'Cormorant Garamond\',Georgia,\'Times New Roman\',serif; font-weight:500; font-size:44px; line-height:1.05; letter-spacing:-0.5px; color:#2A211A;">' + nl2br(data.headline) + '</h1>\n' +
'              <p class="lead" style="margin:22px 0 0; font-family:\'Cormorant Garamond\',Georgia,\'Times New Roman\',serif; font-weight:500; font-style:italic; font-size:22px; line-height:1.5; color:#6F6152;">' + esc(data.lead) + '</p>\n' +
'            </td>\n' +
'          </tr>\n' +
'          <tr>\n' +
'            <td class="px" style="padding:30px 56px 0;">\n' +
'              ' + bodyParagraphs(data.bodyParagraphs) +
'            </td>\n' +
'          </tr>\n' +
'          <tr>\n' +
'            <td align="center" style="padding:30px 40px 4px;">\n' +
'              <!--[if mso]><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#B05E36" style="border-radius:2px;"><![endif]-->\n' +
'              <a href="' + esc(data.ctaUrl) + '" target="_blank" class="hover-cta" style="background-color:#B05E36; border-radius:2px; display:inline-block; font-family:\'Jost\',Helvetica,Arial,sans-serif; font-weight:500; font-size:13px; letter-spacing:2.4px; text-transform:uppercase; color:#FBF7EF; padding:16px 32px; mso-padding-alt:16px 32px;">' + esc(data.ctaLabel) + '&nbsp;&nbsp;&rarr;</a>\n' +
'              <!--[if mso]></td></tr></table><![endif]-->\n' +
'            </td>\n' +
'          </tr>\n' +
'          <tr>\n' +
'            <td align="center" style="padding:40px 56px 36px;">\n' +
'              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>\n' +
'                <td width="44%" style="vertical-align:middle;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="height:1px; background-color:#D9CCB7; line-height:1px; font-size:1px;">&nbsp;</td></tr></table></td>\n' +
'                <td width="12%" align="center" style="vertical-align:middle;"><img src="' + esc(flame) + '" width="18" alt="" style="display:block; width:18px; height:auto; margin:0 auto;"></td>\n' +
'                <td width="44%" style="vertical-align:middle;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="height:1px; background-color:#D9CCB7; line-height:1px; font-size:1px;">&nbsp;</td></tr></table></td>\n' +
'              </tr></table>\n' +
'            </td>\n' +
'          </tr>\n' +
'          <tr>\n' +
'            <td style="padding:0 56px;" class="px">\n' +
'              <img src="' + esc(feature) + '" width="488" alt="' + esc(data.featureAlt || "Moores Home & Garden") + '" class="full feat-img" style="display:block; width:100%; max-width:488px; height:auto; border-radius:2px;">\n' +
'            </td>\n' +
'          </tr>\n' +
'          <tr>\n' +
'            <td class="feat-pad px" style="padding:26px 56px 0;">\n' +
'              <h2 style="margin:0 0 12px; font-family:\'Cormorant Garamond\',Georgia,\'Times New Roman\',serif; font-weight:500; font-size:28px; line-height:1.12; color:#2A211A;">' + esc(data.featureHeading) + '</h2>\n' +
'              <p style="margin:0 0 16px; ' + BODY_P + '">' + esc(data.featureBody) + '</p>\n' +
'              <a href="' + esc(data.secondaryUrl) + '" target="_blank" class="hover-link" style="font-family:\'Jost\',Helvetica,Arial,sans-serif; font-weight:500; font-size:13px; letter-spacing:1.4px; text-transform:uppercase; color:#B05E36; border-bottom:1px solid #B05E36; padding-bottom:3px;">' + esc(data.secondaryLabel) + '</a>\n' +
'            </td>\n' +
'          </tr>\n' +
'          <tr>\n' +
'            <td class="px" style="padding:40px 56px 44px;">\n' +
'              <p style="margin:0; font-family:\'Cormorant Garamond\',Georgia,\'Times New Roman\',serif; font-weight:500; font-style:italic; font-size:21px; line-height:1.4; color:#6F6152;">' + esc(data.signoff) + '</p>\n' +
'            </td>\n' +
'          </tr>\n' +
'          <tr>\n' +
'            <td style="background-color:#2A211A; padding:40px 56px 38px;" class="px">\n' +
'              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">\n' +
'                <tr>\n' +
'                  <td align="center" style="padding-bottom:20px;">\n' +
'                    <img src="' + esc(logoFooter) + '" width="206" alt="Moores Home &amp; Garden" style="display:block; width:206px; max-width:66%; height:auto; margin:0 auto;">\n' +
'                  </td>\n' +
'                </tr>\n' +
'                <tr>\n' +
'                  <td align="center" style="padding-bottom:24px;">\n' +
'                    <p style="margin:0; font-family:\'Jost\',Helvetica,Arial,sans-serif; font-weight:300; font-size:13px; letter-spacing:0.3px; line-height:1.7; color:#B6A993;">Tailored, hand-finished living &mdash; made properly in Sussex.</p>\n' +
'                  </td>\n' +
'                </tr>\n' +
'                <tr>\n' +
'                  <td align="center" style="padding-bottom:20px;">\n' +
'                    <a href="https://mooreshomeandgarden.com/the-range.html" target="_blank" style="font-family:\'Jost\',Helvetica,Arial,sans-serif; font-weight:400; font-size:12px; letter-spacing:1.6px; text-transform:uppercase; color:#E2D7C4; padding:0 10px;">The Range</a>\n' +
'                    <span style="color:#5C4F42;">&middot;</span>\n' +
'                    <a href="https://mooreshomeandgarden.com/own-branding.html" target="_blank" style="font-family:\'Jost\',Helvetica,Arial,sans-serif; font-weight:400; font-size:12px; letter-spacing:1.6px; text-transform:uppercase; color:#E2D7C4; padding:0 10px;">Own Branding</a>\n' +
'                    <span style="color:#5C4F42;">&middot;</span>\n' +
'                    <a href="https://mooreshomeandgarden.com/consultation.html" target="_blank" style="font-family:\'Jost\',Helvetica,Arial,sans-serif; font-weight:400; font-size:12px; letter-spacing:1.6px; text-transform:uppercase; color:#E2D7C4; padding:0 10px;">Consultation</a>\n' +
'                  </td>\n' +
'                </tr>\n' +
'                <tr>\n' +
'                  <td style="height:1px; background-color:#473B30; line-height:1px; font-size:1px; padding:0;">&nbsp;</td>\n' +
'                </tr>\n' +
'                <tr>\n' +
'                  <td align="center" style="padding-top:22px;">\n' +
'                    <p style="margin:0 0 14px; font-family:\'Jost\',Helvetica,Arial,sans-serif; font-weight:300; font-size:12px; line-height:1.7; color:#9C8F7C;">East Grinstead, West Sussex &nbsp;&middot;&nbsp; contact@mooreshomeandgarden.com</p>\n' +
'                    <p style="margin:0 0 16px; font-family:\'Jost\',Helvetica,Arial,sans-serif; font-weight:300; font-size:11px; line-height:1.7; color:#7E7363;">{{SenderInfo}}</p>\n' +
'                    <p style="margin:0; font-family:\'Jost\',Helvetica,Arial,sans-serif; font-weight:400; font-size:11px; letter-spacing:0.5px; line-height:1.7; color:#9C8F7C;"><a href="{{UnsubscribeURL}}" target="_blank" style="color:#C9A87E; text-decoration:underline;">Unsubscribe</a></p>\n' +
'                    <p style="margin:16px 0 0; font-family:\'Jost\',Helvetica,Arial,sans-serif; font-weight:300; font-size:11px; color:#6F6353;">&copy; 2026 Moores Home &amp; Garden</p>\n' +
'                  </td>\n' +
'                </tr>\n' +
'              </table>\n' +
'            </td>\n' +
'          </tr>\n' +
'        </table>\n' +
'        <!--[if mso]></td></tr></table><![endif]-->\n' +
'      </td>\n' +
'    </tr>\n' +
'  </table>\n' +
'</body>\n' +
'</html>';
  };
})();
