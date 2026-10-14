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
  sub: `${OPEN}"A single subwoofer">
  ${G}
    <rect x="58" y="34" width="84" height="92" rx="3"></rect>
    <circle cx="100" cy="80" r="31"></circle>
    <circle cx="100" cy="80" r="11"></circle>
    <path d="M66 126v6M134 126v6"></path>
  </g>
  ${HL}<path d="M34 64h14M28 80h20M34 96h14M166 64h-14M172 80h-20M166 96h-14"></path></g>
</svg>`,

  'subs-tops': `${OPEN}"Two subwoofers with a top speaker on each">
  ${G}
    <rect x="22" y="80" width="52" height="46" rx="2"></rect>
    <circle cx="48" cy="103" r="15"></circle>
    <path d="M30 32h36l4 46H26z"></path>
    <circle cx="48" cy="58" r="10"></circle>
    <circle cx="48" cy="41" r="4.5"></circle>
    <rect x="126" y="80" width="52" height="46" rx="2"></rect>
    <circle cx="152" cy="103" r="15"></circle>
    <path d="M134 32h36l4 46h-44z"></path>
    <circle cx="152" cy="58" r="10"></circle>
    <circle cx="152" cy="41" r="4.5"></circle>
  </g>
  ${HL}<path d="M86 50h12M86 62h20M86 74h12M114 50h-12M114 62h-20M114 74h-12"></path></g>
</svg>`,
  'light-bar': `${OPEN}"A party light bar on a stand">
  ${G}
    <rect x="34" y="34" width="132" height="26" rx="3"></rect>
    <circle cx="56" cy="47" r="6"></circle>
    <circle cx="85" cy="47" r="6"></circle>
    <circle cx="115" cy="47" r="6"></circle>
    <circle cx="144" cy="47" r="6"></circle>
    <path d="M100 60v48M80 132l20-24 20 24"></path>
  </g>
  ${HL}<path d="M56 64l-8 20M85 64l-4 22M115 64l4 22M144 64l8 20"></path></g>
</svg>`,

  'moving-bar': `${OPEN}"A moving light bar on a stand">
  ${G}
    <rect x="30" y="58" width="140" height="14" rx="3"></rect>
    <path d="M44 58v-8h20v8M90 58v-8h20v8M136 58v-8h20v8"></path>
    <rect x="44" y="30" width="20" height="20" rx="4" transform="rotate(-18 54 40)"></rect>
    <rect x="90" y="30" width="20" height="20" rx="4"></rect>
    <rect x="136" y="30" width="20" height="20" rx="4" transform="rotate(18 146 40)"></rect>
    <path d="M100 72v36M80 132l20-24 20 24"></path>
  </g>
  ${HL}<path d="M46 28l-18-18M100 28V6M154 28l18-18"></path></g>
</svg>`,
  strobe: `${OPEN}"Strobe light"${">"}
  ${G}
    <rect x="62" y="56" width="76" height="52" rx="3"></rect>
    <rect x="74" y="68" width="52" height="28" rx="2"></rect>
    <path d="M70 108v14M130 108v14"></path>
    <path d="M58 122h84"></path>
  </g>
  ${HL}<path d="M100 44V22M74 50L60 30M126 50l14-20M52 70L30 62M148 70l22-8M56 90l-22 8M144 90l22 8"></path></g>
</svg>`,

  'moving-head': `${OPEN}"Moving head light"${">"}
  ${G}
    <path d="M62 128h76M80 128v-14h40v14"></path>
    <path d="M76 114V86M124 114V86"></path>
    <path d="M76 86a24 24 0 0 1 48 0"></path>
    <rect x="80" y="46" width="40" height="42" rx="4"></rect>
    <circle cx="100" cy="60" r="9"></circle>
  </g>
  ${HL}<path d="M86 46L54 14M114 46l32-32M100 44V16"></path></g>
</svg>`,

  uplight: `${OPEN}"Uplighting"${">"}
  ${G}
    <path d="M40 128h120"></path>
    <rect x="62" y="104" width="34" height="22" rx="3"></rect>
    <circle cx="79" cy="115" r="5"></circle>
    <rect x="112" y="104" width="34" height="22" rx="3"></rect>
    <circle cx="129" cy="115" r="5"></circle>
  </g>
  ${HL}<path d="M70 100L52 26M88 100l18-74M120 100l-18-74M138 100l18-74"></path></g>
</svg>`,

  'mirror-ball': `${OPEN}"Mirror ball effect light"${">"}
  ${G}
    <path d="M100 14v20"></path>
    <circle cx="100" cy="74" r="40"></circle>
    <path d="M60 74h80M100 34v80"></path>
    <path d="M72 46a52 52 0 0 0 0 56M128 46a52 52 0 0 1 0 56"></path>
    <path d="M64 58h72M64 90h72"></path>
  </g>
  ${HL}<path d="M24 36l10 6M176 36l-10 6M14 86l12 2M186 86l-12 2M40 124l10-8M160 124l-10-8M100 130v8"></path></g>
</svg>`,

  laser: `${OPEN}"Laser"${">"}
  ${G}
    <rect x="54" y="88" width="92" height="38" rx="3"></rect>
    <circle cx="78" cy="107" r="7"></circle>
    <circle cx="100" cy="107" r="7"></circle>
    <circle cx="122" cy="107" r="7"></circle>
  </g>
  ${HL}<path d="M96 86L34 20M100 86V16M104 86l62-66M90 86L18 48M110 86l72-38"></path></g>
</svg>`,

  'festival-system': `${OPEN}"Festival system: subs, tops, moving lights and lasers"${">"}
  ${G}
    <rect x="10" y="92" width="40" height="38" rx="2"></rect>
    <circle cx="30" cy="111" r="11"></circle>
    <path d="M15 58h30l3 32H12z"></path>
    <circle cx="29" cy="74" r="8"></circle>
    <rect x="150" y="92" width="40" height="38" rx="2"></rect>
    <circle cx="170" cy="111" r="11"></circle>
    <path d="M155 58h30l3 32h-36z"></path>
    <circle cx="171" cy="74" r="8"></circle>
    <rect x="74" y="100" width="52" height="30" rx="3"></rect>
    <circle cx="87" cy="115" r="7"></circle>
    <circle cx="113" cy="115" r="7"></circle>
    <path d="M62 46h22v18H62zM116 46h22v18h-22z"></path>
    <path d="M73 64v10M127 64v10"></path>
  </g>
  ${HL}<path d="M68 44L44 16M78 44l6-28M122 44l-6-28M132 44l24-28M100 96V72"></path></g>
</svg>`,
};

/* An unknown key must never break the build — the editor can add a package
   before its drawing exists. Fall back to the plain speaker pair. */
module.exports = function gearArt(key) {
  return ART[key] || ART.speakers;
};
