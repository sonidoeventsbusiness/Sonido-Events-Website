'use strict';

/* Line drawings of the gear, one per hire package.
   Drawn rather than photographed: manufacturer and retailer product shots are
   their copyright and have no place on a commercial hire page, and they would
   not be our equipment anyway. These stay honest whatever is in the van, and
   they scale to any size. Replace with real photographs when we have them. */

const OPEN = '<svg viewBox="0 0 200 150" role="img" aria-label=';
const G = '<g fill="none" stroke="currentColor" stroke-width="2.1" stroke-linejoin="round" stroke-linecap="round">';
const HL = '<g stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity=".45">';

const ART = {
  speakers: `${OPEN}"Two speakers on tripod stands">
  ${G}
    <path d="M42 62v46M26 132l16-24 16 24"></path>
    <path d="M28 20h28l4 42H24z"></path>
    <circle cx="42" cy="46" r="9"></circle>
    <circle cx="42" cy="30" r="4.5"></circle>
    <path d="M158 62v46M142 132l16-24 16 24"></path>
    <path d="M144 20h28l4 42h-36z"></path>
    <circle cx="158" cy="46" r="9"></circle>
    <circle cx="158" cy="30" r="4.5"></circle>
  </g>
  ${HL}<path d="M76 40h12M76 50h18M124 40h-12M124 50h-18"></path></g>
</svg>`,

  'speakers-large': `${OPEN}"Two large speakers on stands">
  ${G}
    <path d="M40 74v34M22 132l18-24 18 24"></path>
    <path d="M22 14h32l5 60H17z"></path>
    <circle cx="38" cy="50" r="12.5"></circle>
    <circle cx="38" cy="26" r="5.5"></circle>
    <path d="M160 74v34M142 132l18-24 18 24"></path>
    <path d="M146 14h32l5 60h-42z"></path>
    <circle cx="162" cy="50" r="12.5"></circle>
    <circle cx="162" cy="26" r="5.5"></circle>
  </g>
  ${HL}<path d="M74 36h16M74 50h24M74 64h16M126 36h-16M126 50h-24M126 64h-16"></path></g>
</svg>`,

  'mixer-mic': `${OPEN}"Audio mixer and microphone">
  ${G}
    <rect x="24" y="66" width="96" height="54" rx="3"></rect>
    <circle cx="42" cy="82" r="5"></circle>
    <circle cx="60" cy="82" r="5"></circle>
    <circle cx="78" cy="82" r="5"></circle>
    <circle cx="96" cy="82" r="5"></circle>
    <path d="M42 98v14M60 98v14M78 98v14M96 98v14"></path>
    <path d="M36 106h12M54 100h12M72 108h12M90 102h12"></path>
    <rect x="146" y="22" width="20" height="40" rx="10"></rect>
    <path d="M138 56a18 18 0 0 0 36 0M156 74v22M142 120h28"></path>
    <path d="M156 96l-8 24h16z"></path>
  </g>
  ${HL}<path d="M150 30h12M150 38h12M150 46h12"></path></g>
</svg>`,

  decks: `${OPEN}"All-in-one DJ controller">
  ${G}
    <rect x="18" y="34" width="164" height="84" rx="4"></rect>
    <circle cx="52" cy="84" r="20"></circle>
    <circle cx="52" cy="84" r="7"></circle>
    <circle cx="148" cy="84" r="20"></circle>
    <circle cx="148" cy="84" r="7"></circle>
    <rect x="80" y="44" width="40" height="24" rx="2"></rect>
    <path d="M88 78v28M100 78v28M112 78v28"></path>
    <path d="M83 94h10M95 88h10M107 98h10"></path>
  </g>
  ${HL}<path d="M86 52h28M86 60h18"></path></g>
</svg>`,

  'pa-decks': `${OPEN}"Speakers on stands with a DJ controller">
  ${G}
    <path d="M28 56v50M14 130l14-24 14 24"></path>
    <path d="M16 14h24l4 42H12z"></path>
    <circle cx="28" cy="38" r="9"></circle>
    <path d="M172 56v50M158 130l14-24 14 24"></path>
    <path d="M160 14h24l4 42h-32z"></path>
    <circle cx="172" cy="38" r="9"></circle>
    <rect x="58" y="76" width="84" height="46" rx="3"></rect>
    <circle cx="76" cy="99" r="11"></circle>
    <circle cx="124" cy="99" r="11"></circle>
    <rect x="92" y="84" width="16" height="12" rx="1.5"></rect>
    <path d="M94 104v12M100 104v12M106 104v12"></path>
  </g>
</svg>`,

  'full-system': `${OPEN}"Subwoofers, tops and a DJ controller">
  ${G}
    <rect x="12" y="84" width="44" height="42" rx="2"></rect>
    <circle cx="34" cy="105" r="13"></circle>
    <path d="M18 46h32l3 36H15z"></path>
    <circle cx="33" cy="66" r="9"></circle>
    <rect x="144" y="84" width="44" height="42" rx="2"></rect>
    <circle cx="166" cy="105" r="13"></circle>
    <path d="M150 46h32l3 36h-38z"></path>
    <circle cx="167" cy="66" r="9"></circle>
    <rect x="66" y="92" width="68" height="34" rx="3"></rect>
    <circle cx="81" cy="109" r="8"></circle>
    <circle cx="119" cy="109" r="8"></circle>
    <rect x="93" y="99" width="14" height="10" rx="1.5"></rect>
  </g>
  ${HL}<path d="M70 52h14M70 62h22M130 52h-14M130 62h-22"></path></g>
</svg>`,
};

/* An unknown key must never break the build — the editor can add a package
   before its drawing exists. Fall back to the plain speaker pair. */
module.exports = function gearArt(key) {
  return ART[key] || ART.speakers;
};
