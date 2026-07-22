import { AVATAR_HEADWEAR_ANCHORS } from '../avatarGeometry.js';
import { EmptyPart } from './faces.jsx';

function HatFinish({
  palette,
  paints,
  baseD,
  shadowD,
  highlightD,
  detailD,
  strokeWidth = 3,
}) {
  return (
    <g className="avatar-hat-finish">
      <path
        className="avatar-hat-base avatar-outline"
        d={baseD}
        fill={paints.hat}
        stroke={palette.hat.outline}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        className="avatar-hat-shadow avatar-hat-panel"
        d={shadowD}
        fill={palette.hat.deep}
        opacity="0.66"
      />
      <path
        className="avatar-hat-highlight avatar-highlight"
        d={highlightD}
        fill="none"
        stroke={palette.hat.highlight}
        strokeWidth="2.05"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
      <path
        className="avatar-hat-detail avatar-detail"
        d={detailD}
        fill="none"
        stroke={palette.hat.shadow}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.86"
      />
    </g>
  );
}

function Crown({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hat:crown" data-avatar-skull-anchor={AVATAR_HEADWEAR_ANCHORS.skullTop.y} data-hair-coverage="covers" data-hat-tone={config.hat_color || palette.hat.base}>
      <HatFinish
        palette={palette}
        paints={paints}
        baseD="M77 49 L83 19 L100 37 L119 13 L139 37 L158 19 L164 50 C142 57 99 57 77 49 Z"
        shadowD="M79 43 C102 49 139 49 162 43 L164 50 C141 58 100 58 77 49 Z"
        highlightD="M84 39 L87 27 M101 39 L116 19 M139 39 L154 27"
        detailD="M81 44 C102 50 139 50 161 44 M100 37 L105 48 M139 37 L134 48"
      />
      <path className="avatar-crown-band avatar-outline" d="M78 46 C101 51 139 51 163 46 L163 57 C139 62 101 62 78 57 Z" fill={palette.hat.shadow} stroke={palette.hat.outline} strokeWidth="2.2" strokeLinejoin="round" />
      <path className="avatar-crown-band avatar-highlight" d="M84 49 C103 53 134 53 153 50" fill="none" stroke={palette.hat.highlight} strokeWidth="1.6" strokeLinecap="round" />
      <path className="avatar-gem avatar-outline" d="M93 49 L98 45 L103 49 L98 55 Z" fill="#50d8ff" stroke={palette.hat.outline} strokeWidth="1" />
      <path className="avatar-gem avatar-outline" d="M114 49 L120 44 L126 49 L120 56 Z" fill="#f26da5" stroke={palette.hat.outline} strokeWidth="1" />
      <path className="avatar-gem avatar-outline" d="M137 49 L142 45 L147 49 L142 55 Z" fill="#78e09c" stroke={palette.hat.outline} strokeWidth="1" />
      <circle className="avatar-highlight" cx="118.5" cy="47.5" r="1.1" fill="#ffffff" />
    </g>
  );
}

function WizardHat({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hat:wizard" data-avatar-skull-anchor={AVATAR_HEADWEAR_ANCHORS.skullTop.y} data-hair-coverage="covers" data-hat-tone={config.hat_color || palette.hat.base}>
      <HatFinish
        palette={palette}
        paints={paints}
        baseD="M82 49 C91 41 101 33 108 24 C113 18 118 14 125 12 C123 23 129 31 143 37 C135 39 134 46 143 52 C124 58 101 57 82 49 Z M68 53 C94 47 145 47 173 54 C166 65 78 65 68 53 Z"
        shadowD="M105 35 C116 40 126 45 143 48 L143 52 C125 57 104 56 86 50 C93 45 99 40 105 35 Z M77 57 C100 61 143 61 165 56 C154 66 91 67 77 57 Z"
        highlightD="M101 36 C108 29 114 21 121 18 M76 54 C98 50 128 51 151 54"
        detailD="M107 25 C112 33 121 39 133 42 M92 46 C105 48 119 49 136 48 M84 59 C103 63 137 63 158 59"
      />
      <path className="avatar-wizard-band avatar-outline" d="M85 45 C102 49 125 51 144 48 L148 56 C125 62 99 59 80 53 Z" fill={palette.gear.deep} stroke={palette.hat.outline} strokeWidth="2" strokeLinejoin="round" />
      <path className="avatar-wizard-buckle avatar-outline" d="M111 49 L122 49 L123 57 L112 56 Z" fill={palette.hat.highlight} stroke={palette.hat.outline} strokeWidth="1.2" />
      <path className="avatar-wizard-star avatar-highlight" d="M113 27 L116 32 L122 32 L118 36 L119 42 L113 39 L108 42 L109 36 L105 32 L111 32 Z" fill="#ffe36b" stroke={palette.hat.outline} strokeWidth="0.9" strokeLinejoin="round" />
      <path className="avatar-wizard-moon avatar-detail" d="M129 27 C136 25 139 31 136 36 C131 40 126 36 128 31 C129 34 133 34 134 31 C134 29 132 28 129 27 Z" fill="#b7efff" stroke={palette.hat.outline} strokeWidth="0.8" />
    </g>
  );
}

function Beanie({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hat:beanie" data-avatar-skull-anchor={AVATAR_HEADWEAR_ANCHORS.skullTop.y} data-hair-coverage="covers" data-hat-tone={config.hat_color || palette.hat.base}>
      <HatFinish
        palette={palette}
        paints={paints}
        baseD="M79 54 C79 35 95 21 116 20 C139 18 159 32 162 54 C142 62 99 62 79 54 Z"
        shadowD="M81 47 C101 54 141 55 160 47 L162 54 C140 63 100 62 79 54 Z"
        highlightD="M91 41 C96 31 107 26 118 25 M125 24 C136 25 146 31 151 39"
        detailD="M96 30 C93 39 94 48 97 57 M111 24 C109 35 109 47 111 59 M127 23 C130 35 130 47 127 59 M143 29 C148 40 147 49 143 57"
      />
      <path className="avatar-beanie-cuff avatar-outline" d="M78 49 C101 56 141 56 163 49 L164 62 C141 70 99 69 77 61 Z" fill={palette.hat.shadow} stroke={palette.hat.outline} strokeWidth="2.5" strokeLinejoin="round" />
      <path className="avatar-beanie-rib avatar-detail" d="M87 54 L87 63 M98 57 L98 66 M110 58 L110 67 M122 58 L122 67 M134 57 L134 66 M146 55 L146 64 M157 52 L157 61" fill="none" stroke={palette.hat.light} strokeWidth="1.35" opacity="0.7" />
      <path className="avatar-beanie-pom avatar-outline" d="M109 21 C103 15 107 8 114 11 C118 5 127 8 127 14 C134 16 132 24 125 25 C120 29 112 27 109 21 Z" fill={paints.hat} stroke={palette.hat.outline} strokeWidth="2.2" strokeLinejoin="round" />
      <path className="avatar-highlight" d="M113 16 C117 12 122 12 125 15" fill="none" stroke={palette.hat.highlight} strokeWidth="1.4" strokeLinecap="round" />
    </g>
  );
}

function Cap({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hat:cap" data-avatar-skull-anchor={AVATAR_HEADWEAR_ANCHORS.skullTop.y} data-hair-coverage="covers" data-hat-tone={config.hat_color || palette.hat.base}>
      <HatFinish
        palette={palette}
        paints={paints}
        baseD="M80 54 C83 35 99 24 120 24 C141 24 157 35 161 53 C141 59 101 60 80 54 Z"
        shadowD="M82 48 C102 54 141 54 159 47 L161 53 C141 60 101 60 80 54 Z"
        highlightD="M92 41 C100 32 110 29 120 29 M130 29 C141 32 149 38 153 45"
        detailD="M120 25 L120 54 M91 38 C101 43 110 47 120 54 M149 38 C139 44 130 48 120 54"
      />
      <path className="avatar-cap-brim avatar-outline" d="M78 51 C65 53 55 59 55 65 C74 68 95 64 111 56 C101 51 89 49 78 51 Z" fill={paints.hat} stroke={palette.hat.outline} strokeWidth="2.7" strokeLinejoin="round" />
      <path className="avatar-cap-brim-shadow" d="M60 62 C75 63 91 60 104 55 C95 63 77 68 58 65 Z" fill={palette.hat.deep} opacity="0.64" />
      <path className="avatar-cap-brim-highlight avatar-highlight" d="M63 59 C75 55 88 54 98 56" fill="none" stroke={palette.hat.highlight} strokeWidth="1.8" strokeLinecap="round" />
      <circle className="avatar-cap-button avatar-outline" cx="120" cy="24" r="3" fill={palette.hat.light} stroke={palette.hat.outline} strokeWidth="1.2" />
      <path className="avatar-cap-badge avatar-detail" d="M112 36 L120 32 L128 36 L124 44 L116 44 Z" fill={palette.hat.light} stroke={palette.hat.outline} strokeWidth="1" />
    </g>
  );
}

function PirateHat({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hat:pirate" data-avatar-skull-anchor={AVATAR_HEADWEAR_ANCHORS.skullTop.y} data-hair-coverage="covers" data-hat-tone={config.hat_color || palette.hat.base}>
      <HatFinish
        palette={palette}
        paints={paints}
        baseD="M72 51 C79 43 88 37 98 34 C104 24 114 19 121 20 C130 18 140 24 144 34 C155 37 164 43 170 52 C151 59 90 59 72 51 Z"
        shadowD="M78 49 C101 53 143 54 165 49 L170 52 C149 61 92 60 72 51 Z"
        highlightD="M91 43 C101 36 111 32 122 32 M128 31 C139 33 149 38 157 44"
        detailD="M98 34 C110 38 133 39 144 34 M84 48 C105 53 138 53 159 48"
      />
      <path className="avatar-pirate-brim avatar-outline" d="M69 48 C85 54 103 54 120 47 C138 55 155 54 172 48 C167 63 142 68 120 57 C97 68 74 62 69 48 Z" fill={palette.gear.deep} stroke={palette.hat.outline} strokeWidth="2.5" strokeLinejoin="round" />
      <path className="avatar-pirate-band avatar-outline" d="M91 37 C109 42 132 42 151 37 L154 45 C133 50 108 50 87 44 Z" fill={paints.hat} stroke={palette.hat.outline} strokeWidth="1.8" />
      <circle className="avatar-pirate-skull avatar-outline" cx="121" cy="44" r="6.8" fill="#f4eee0" stroke={palette.hat.outline} strokeWidth="1.2" />
      <circle cx="118.5" cy="43" r="1.25" fill={palette.gear.deep} />
      <circle cx="123.5" cy="43" r="1.25" fill={palette.gear.deep} />
      <path className="avatar-pirate-bones avatar-detail" d="M112 51 L130 58 M130 51 L112 58 M118 47 L120 50 L122 47" fill="none" stroke="#f4eee0" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

function Headphones({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hat:headphones" data-avatar-skull-anchor={AVATAR_HEADWEAR_ANCHORS.skullTop.y} data-hair-coverage="reveals" data-hat-tone={config.hat_color || palette.hat.base}>
      <HatFinish
        palette={palette}
        paints={paints}
        baseD="M78 82 C74 55 85 30 105 22 C126 14 151 25 160 45 C165 55 166 68 163 82 L155 79 C157 58 151 40 136 31 C119 20 99 28 89 43 C82 54 82 67 86 80 Z M69 72 C76 67 86 70 90 78 L90 100 C84 110 72 108 67 99 Z M151 78 C155 69 166 67 173 72 L175 99 C170 108 158 110 151 101 Z"
        shadowD="M78 82 C75 59 83 39 98 28 C86 41 82 59 86 80 Z M68 87 C75 94 82 96 90 91 L90 100 C84 110 72 108 67 99 Z M151 91 C159 96 168 94 174 87 L175 99 C170 108 158 110 151 101 Z"
        highlightD="M88 45 C95 31 110 24 124 24 M72 77 C77 73 83 75 86 80 M158 77 C163 73 169 76 171 81"
        detailD="M84 62 C82 48 88 37 98 29 M156 62 C158 48 152 37 142 30 M76 82 L76 98 M164 81 L164 99"
      />
      <path className="avatar-headphone-pad avatar-outline" d="M70 78 C76 73 84 76 87 83 L87 98 C82 105 74 104 70 98 Z" fill={palette.gear.deep} stroke={palette.hat.outline} strokeWidth="1.8" />
      <path className="avatar-headphone-pad avatar-outline" d="M153 83 C156 76 164 73 170 78 L170 98 C166 104 158 105 153 98 Z" fill={palette.gear.deep} stroke={palette.hat.outline} strokeWidth="1.8" />
      <path className="avatar-headphone-panel avatar-highlight" d="M74 83 L82 81 L82 98 L75 99 Z M158 81 L166 83 L165 99 L158 98 Z" fill={palette.hat.light} stroke={palette.hat.outline} strokeWidth="1" />
      <path className="avatar-headphone-bolt avatar-detail" d="M79 85 L75 91 L79 91 L76 97 M161 85 L165 91 L161 91 L164 97" fill="none" stroke={palette.hat.highlight} strokeWidth="1.4" strokeLinejoin="round" />
    </g>
  );
}

function Tiara({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hat:tiara" data-avatar-skull-anchor={AVATAR_HEADWEAR_ANCHORS.skullTop.y} data-hair-coverage="reveals" data-hat-tone={config.hat_color || palette.hat.base}>
      <HatFinish
        palette={palette}
        paints={paints}
        baseD="M82 52 C91 43 100 39 108 40 L120 19 L133 40 C143 39 152 43 160 52 C139 59 102 59 82 52 Z"
        shadowD="M85 50 C105 54 139 54 157 50 L160 52 C139 60 102 59 82 52 Z"
        highlightD="M91 48 C99 42 105 42 111 44 M114 35 L120 24 L126 35 M139 43 C146 44 151 47 154 50"
        detailD="M90 48 C102 52 108 50 120 40 C131 50 139 52 151 48 M87 54 C106 58 135 58 155 54"
      />
      <path className="avatar-tiara-band avatar-outline" d="M80 51 C103 57 138 57 162 51 L163 57 C139 64 102 64 79 57 Z" fill={palette.hat.light} stroke={palette.hat.outline} strokeWidth="1.8" />
      <path className="avatar-tiara-gem avatar-outline" d="M113 40 L120 31 L127 40 L120 49 Z" fill="#63ddff" stroke={palette.hat.outline} strokeWidth="1.2" />
      <circle className="avatar-tiara-gem avatar-outline" cx="101" cy="48" r="3.2" fill="#f982c2" stroke={palette.hat.outline} strokeWidth="1" />
      <circle className="avatar-tiara-gem avatar-outline" cx="140" cy="48" r="3.2" fill="#9e8cff" stroke={palette.hat.outline} strokeWidth="1" />
      <path className="avatar-highlight" d="M117 37 L120 34" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  );
}

function Horns({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hat:horns" data-avatar-skull-anchor={AVATAR_HEADWEAR_ANCHORS.skullTop.y} data-hair-coverage="reveals" data-hat-tone={config.hat_color || palette.hat.base}>
      <HatFinish
        palette={palette}
        paints={paints}
        baseD="M88 55 C76 49 68 39 68 28 C68 18 76 13 84 15 C78 22 80 31 87 34 C94 37 99 44 98 52 Z M152 52 C151 44 146 37 153 34 C160 31 162 22 156 15 C164 13 172 18 172 28 C172 39 164 49 152 55 Z"
        shadowD="M76 20 C73 30 79 39 90 43 C94 46 96 49 97 52 C87 49 78 43 74 35 C70 28 71 23 76 20 Z M164 20 C169 23 170 28 166 35 C162 43 153 49 143 52 C144 49 146 46 150 43 C161 39 167 30 164 20 Z"
        highlightD="M77 19 C73 25 75 31 80 35 M163 19 C167 25 165 31 160 35"
        detailD="M73 30 C78 28 83 28 87 31 M79 41 C84 39 90 40 94 43 M167 30 C162 28 157 28 153 31 M161 41 C156 39 150 40 146 43"
      />
      <path className="avatar-horn-band avatar-outline" d="M83 47 C94 43 101 46 105 53 L100 61 C94 55 88 54 80 55 Z M157 47 C146 43 139 46 135 53 L140 61 C146 55 152 54 160 55 Z" fill={palette.gear.deep} stroke={palette.hat.outline} strokeWidth="1.8" />
      <path className="avatar-horn-tip avatar-highlight" d="M69 28 C68 21 74 14 82 15 M171 28 C172 21 166 14 158 15" fill="none" stroke={palette.gear.highlight} strokeWidth="2" strokeLinecap="round" />
      <path className="avatar-horn-ridge avatar-detail" d="M75 25 L83 27 M78 36 L89 37 M165 25 L157 27 M162 36 L151 37" fill="none" stroke={palette.hat.outline} strokeWidth="1.2" strokeLinecap="round" />
    </g>
  );
}

function BunnyEars({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hat:bunny_ears" data-avatar-skull-anchor={AVATAR_HEADWEAR_ANCHORS.skullTop.y} data-hair-coverage="reveals" data-hat-tone={config.hat_color || palette.hat.base}>
      <HatFinish
        palette={palette}
        paints={paints}
        baseD="M86 51 C77 39 74 24 82 15 C89 8 99 15 100 26 C101 37 97 45 94 52 Z M146 52 C143 45 139 37 140 26 C141 15 151 8 158 15 C166 24 163 39 154 51 Z M80 53 C101 47 139 47 161 53 L158 62 C137 57 103 57 82 62 Z"
        shadowD="M89 48 C83 37 81 25 86 18 C90 14 95 19 95 28 C96 37 93 44 89 48 Z M151 48 C157 37 159 25 154 18 C150 14 145 19 145 28 C144 37 147 44 151 48 Z M83 56 C104 52 136 52 158 56 L158 62 C136 57 104 57 82 62 Z"
        highlightD="M84 20 C80 28 83 37 88 43 M156 20 C160 28 157 37 152 43 M89 54 C105 50 130 50 147 54"
        detailD="M89 17 C94 25 94 37 90 47 M151 17 C146 25 146 37 150 47 M82 58 C103 54 137 54 158 58"
      />
      <path className="avatar-bunny-inner avatar-outline" d="M87 43 C82 33 82 24 87 20 C92 21 94 30 92 39 Z M153 43 C158 33 158 24 153 20 C148 21 146 30 148 39 Z" fill="#f79bb7" stroke={palette.hat.outline} strokeWidth="1.1" opacity="0.84" />
      <path className="avatar-bunny-headband avatar-outline" d="M79 53 C101 48 139 48 162 53 L161 60 C138 56 102 56 80 60 Z" fill={paints.hat} stroke={palette.hat.outline} strokeWidth="2" />
      <circle className="avatar-bunny-stud avatar-highlight" cx="91" cy="56" r="2" fill={palette.hat.highlight} />
      <circle className="avatar-bunny-stud avatar-highlight" cx="149" cy="56" r="2" fill={palette.hat.highlight} />
    </g>
  );
}

function CatEars({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hat:cat_ears" data-avatar-skull-anchor={AVATAR_HEADWEAR_ANCHORS.skullTop.y} data-hair-coverage="reveals" data-hat-tone={config.hat_color || palette.hat.base}>
      <HatFinish
        palette={palette}
        paints={paints}
        baseD="M78 54 L86 17 L108 45 C116 42 124 42 132 45 L156 20 L163 54 C141 61 100 61 78 54 Z"
        shadowD="M83 28 L103 49 C91 48 84 50 79 54 Z M157 28 L137 49 C149 48 156 50 162 54 Z M91 53 C108 57 132 57 149 53 C137 62 103 62 91 53 Z"
        highlightD="M84 23 L102 44 M156 23 L138 44 M99 51 C111 47 129 47 141 51"
        detailD="M84 18 L88 49 M156 18 L152 49 M80 55 C103 60 138 60 162 55"
      />
      <path className="avatar-cat-inner avatar-outline" d="M86 24 L89 45 L101 43 Z M154 24 L151 45 L139 43 Z" fill="#f58fb3" stroke={palette.hat.outline} strokeWidth="1.2" opacity="0.84" />
      <path className="avatar-cat-headband avatar-outline" d="M78 52 C101 58 140 58 163 52 L162 61 C140 67 101 67 79 61 Z" fill={paints.hat} stroke={palette.hat.outline} strokeWidth="2.1" />
      <path className="avatar-cat-stitch avatar-detail" d="M87 56 C104 61 136 61 153 56" fill="none" stroke={palette.hat.light} strokeWidth="1.4" strokeDasharray="3 3" strokeLinecap="round" />
      <circle className="avatar-highlight" cx="90" cy="29" r="1.4" fill="#ffffff" opacity="0.72" />
    </g>
  );
}

function Halo({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hat:halo" data-avatar-skull-anchor={AVATAR_HEADWEAR_ANCHORS.skullTop.y} data-hair-coverage="reveals" data-hat-tone={config.hat_color || palette.hat.base}>
      <HatFinish
        palette={palette}
        paints={paints}
        baseD="M76 22 C82 12 101 9 121 10 C142 10 160 13 165 22 C160 32 141 35 120 35 C99 35 81 32 76 22 Z M87 22 C93 17 105 16 120 16 C136 16 149 17 155 22 C149 27 136 29 120 29 C104 29 93 27 87 22 Z"
        shadowD="M78 22 C85 28 101 31 120 31 C140 31 156 28 163 22 C159 31 141 35 120 35 C99 35 81 32 76 22 Z"
        highlightD="M84 18 C95 13 109 13 121 13 M130 13 C142 14 152 16 158 20"
        detailD="M82 25 C94 30 108 32 121 32 M132 31 C145 30 155 26 161 22"
      />
      <path className="avatar-halo-inner avatar-outline" d="M87 22 C93 17 105 16 120 16 C136 16 149 17 155 22 C149 27 136 29 120 29 C104 29 93 27 87 22 Z" fill={palette.background.deep} fillOpacity="0.92" stroke={palette.hat.highlight} strokeWidth="1.4" />
      <path className="avatar-halo-ray avatar-highlight" d="M92 13 L88 8 M112 10 L111 5 M132 10 L134 5 M151 14 L155 9" fill="none" stroke={palette.hat.highlight} strokeWidth="1.6" strokeLinecap="round" opacity="0.78" />
      <path className="avatar-halo-glint avatar-highlight" d="M72 20 L76 22 L72 24 L70 28 L68 24 L64 22 L68 20 L70 16 Z M170 18 L173 21 L177 22 L173 24 L171 28 L169 24 L165 22 L169 21 Z" fill={palette.hat.highlight} stroke={palette.hat.outline} strokeWidth="0.7" />
      <path className="avatar-halo-tether avatar-detail" d="M95 31 C96 36 98 39 101 42 M145 31 C144 36 142 39 139 42" fill="none" stroke={palette.hat.light} strokeWidth="1" strokeDasharray="2 3" opacity="0.55" />
    </g>
  );
}

function VikingHelmet({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hat:viking" data-avatar-skull-anchor={AVATAR_HEADWEAR_ANCHORS.skullTop.y} data-hair-coverage="covers" data-hat-tone={config.hat_color || palette.hat.base}>
      <HatFinish
        palette={palette}
        paints={paints}
        baseD="M80 57 C81 36 98 23 120 23 C143 23 159 36 161 57 C140 65 101 65 80 57 Z M84 43 C72 42 64 34 65 24 C66 17 72 13 79 15 C74 24 78 31 88 33 Z M156 43 C168 42 176 34 175 24 C174 17 168 13 161 15 C166 24 162 31 152 33 Z"
        shadowD="M83 48 C103 55 140 55 158 48 L161 57 C140 66 101 65 80 57 Z M70 20 C68 30 74 36 84 38 L88 43 C76 42 65 35 65 24 C66 21 67 20 70 20 Z M170 20 C172 30 166 36 156 38 L152 43 C164 42 175 35 175 24 C174 21 173 20 170 20 Z"
        highlightD="M92 40 C99 31 109 27 120 27 M130 28 C141 31 150 38 153 46 M69 21 C68 28 72 33 78 35"
        detailD="M120 24 L120 59 M90 35 C99 42 108 49 120 58 M150 35 C141 42 132 49 120 58 M67 28 L80 29 M173 28 L160 29"
      />
      <path className="avatar-viking-band avatar-outline" d="M79 51 C101 58 140 58 162 51 L163 62 C140 70 101 70 78 62 Z" fill={palette.gear.light} stroke={palette.hat.outline} strokeWidth="2.3" />
      <path className="avatar-viking-noseguard avatar-outline" d="M115 30 L125 30 L128 74 L120 82 L112 74 Z" fill={palette.gear.light} stroke={palette.hat.outline} strokeWidth="1.8" strokeLinejoin="round" />
      <circle className="avatar-viking-rivet avatar-outline" cx="91" cy="59" r="3" fill={palette.hat.light} stroke={palette.hat.outline} strokeWidth="1" />
      <circle className="avatar-viking-rivet avatar-outline" cx="149" cy="59" r="3" fill={palette.hat.light} stroke={palette.hat.outline} strokeWidth="1" />
      <path className="avatar-viking-horn-highlight avatar-highlight" d="M68 22 C68 17 73 14 78 15 M172 22 C172 17 167 14 162 15" fill="none" stroke={palette.gear.highlight} strokeWidth="1.6" strokeLinecap="round" />
    </g>
  );
}

function StarHeadset({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hat:star_headset" data-avatar-skull-anchor={AVATAR_HEADWEAR_ANCHORS.skullTop.y} data-hair-coverage="reveals" data-hat-tone={config.hat_color || palette.hat.base}>
      <HatFinish
        palette={palette}
        paints={paints}
        baseD="M78 82 C74 54 86 31 106 22 C126 14 151 25 160 45 C165 56 166 68 163 82 L155 79 C157 58 151 40 136 31 C119 20 99 28 89 43 C82 54 82 67 86 80 Z M68 74 C75 68 86 70 90 79 L90 101 C84 111 72 109 67 100 Z M150 79 C154 69 166 67 174 74 L176 100 C170 109 157 111 150 101 Z"
        shadowD="M78 82 C75 60 82 41 97 29 C86 42 82 59 86 80 Z M68 89 C76 95 83 96 90 91 L90 101 C84 111 72 109 67 100 Z M150 91 C158 96 169 95 175 88 L176 100 C170 109 157 111 150 101 Z"
        highlightD="M88 45 C96 31 110 24 124 24 M72 78 C77 74 83 76 86 81 M158 78 C164 73 170 76 172 82"
        detailD="M84 62 C82 48 88 37 98 29 M156 62 C158 48 152 37 142 30 M76 83 L76 99 M164 82 L164 100"
      />
      <path className="avatar-star-earcup avatar-outline" d="M70 80 C76 74 84 77 87 84 L87 99 C82 106 74 105 70 99 Z M153 84 C156 77 164 74 171 80 L171 99 C166 105 158 106 153 99 Z" fill={palette.gear.deep} stroke={palette.hat.outline} strokeWidth="1.8" />
      <path className="avatar-star-emblem avatar-outline" d="M120 15 L124 23 L133 24 L126 30 L128 39 L120 34 L112 39 L114 30 L107 24 L116 23 Z" fill="#ffe45d" stroke={palette.hat.outline} strokeWidth="1.5" strokeLinejoin="round" />
      <path className="avatar-star-panel avatar-highlight" d="M78 82 L81 87 L86 88 L82 92 L83 98 L78 95 L73 98 L74 92 L70 88 L76 87 Z M162 82 L165 87 L170 88 L166 92 L167 98 L162 95 L157 98 L158 92 L154 88 L160 87 Z" fill="#ff71cf" stroke={palette.hat.outline} strokeWidth="0.9" />
      <path className="avatar-headset-mic avatar-outline" d="M171 96 C180 99 181 108 174 113 L163 113" fill="none" stroke={paints.hat} strokeWidth="3" strokeLinecap="round" />
      <circle className="avatar-headset-mic-tip avatar-outline" cx="160" cy="113" r="3" fill="#65e6ff" stroke={palette.hat.outline} strokeWidth="1" />
    </g>
  );
}

function HunterHood({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hat:hunter_hood" data-avatar-skull-anchor={AVATAR_HEADWEAR_ANCHORS.skullTop.y} data-hair-coverage="occludes" data-hat-tone={config.hat_color || palette.hat.base}>
      <HatFinish
        palette={palette}
        paints={paints}
        baseD="M69 117 C58 126 53 142 58 157 C77 150 94 146 112 148 C130 145 151 149 181 158 C185 142 178 126 168 116 C149 124 91 124 69 117 Z"
        shadowD="M62 143 C85 136 104 137 120 142 C141 136 160 141 178 150 L181 158 C153 149 132 146 112 148 C94 146 77 150 58 157 Z"
        highlightD="M67 130 C82 124 96 124 108 127 M137 126 C150 124 163 129 172 138"
        detailD="M65 144 C83 138 99 139 112 144 M130 142 C146 139 160 143 176 151"
      />
      <path
        className="avatar-hood-occluder avatar-outline"
        d="M120 17 C89 17 67 37 64 69 C61 94 65 120 73 139 C85 128 94 124 103 126 C112 131 128 131 138 126 C148 123 157 128 168 139 C177 116 180 91 176 68 C172 36 151 17 120 17 Z M120 51 C140 50 155 64 158 83 C161 103 153 121 139 130 C130 137 111 137 101 130 C87 121 80 102 83 83 C86 64 100 50 120 51 Z"
        fill={paints.hat}
        fillRule="evenodd"
        clipRule="evenodd"
        stroke={palette.hat.outline}
        strokeWidth="3.1"
        strokeLinejoin="round"
      />
      <path className="avatar-hood-shadow avatar-hat-panel" d="M75 67 C82 45 98 30 120 27 C143 29 159 46 166 69 C156 58 146 51 134 48 C120 43 102 48 91 60 C83 69 79 83 80 98 C74 88 72 77 75 67 Z" fill={palette.hat.deep} opacity="0.52" />
      <path className="avatar-hood-rim avatar-outline" d="M120 49 C99 49 84 65 81 84 C78 104 87 123 101 132 M120 49 C141 49 156 65 159 84 C162 104 153 123 139 132" fill="none" stroke={palette.hat.light} strokeWidth="4.5" strokeLinecap="round" />
      <path className="avatar-hood-rim avatar-highlight" d="M91 72 C97 59 108 54 119 53 M143 60 C150 68 154 78 154 89" fill="none" stroke={palette.hat.highlight} strokeWidth="1.7" strokeLinecap="round" />
      <path className="avatar-hood-stitch avatar-detail" d="M74 111 C82 123 89 130 99 135 M166 111 C158 123 151 130 141 135" fill="none" stroke={palette.hat.light} strokeWidth="1.4" strokeDasharray="3 3" strokeLinecap="round" />
      <path className="avatar-hunter-clasp avatar-outline" d="M112 137 L120 131 L128 137 L124 146 L116 146 Z" fill={palette.gear.light} stroke={palette.hat.outline} strokeWidth="1.4" />
      <path className="avatar-hunter-rune avatar-detail" d="M117 139 L120 135 L123 139 L120 143 Z" fill="#8ff1ff" stroke={palette.hat.outline} strokeWidth="0.7" />
    </g>
  );
}

function KittyBowEars({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hat:kitty_bow_ears" data-avatar-skull-anchor={AVATAR_HEADWEAR_ANCHORS.skullTop.y} data-hair-coverage="reveals" data-hat-tone={config.hat_color || palette.hat.base}>
      <HatFinish
        palette={palette}
        paints={paints}
        baseD="M78 54 L82 16 L108 45 C116 42 124 42 132 45 L158 16 L163 54 C141 61 100 61 78 54 Z"
        shadowD="M83 28 L103 49 C91 48 84 50 79 54 Z M157 28 L137 49 C149 48 156 50 162 54 Z M91 53 C108 57 132 57 149 53 C137 62 103 62 91 53 Z"
        highlightD="M84 23 L102 44 M156 23 L138 44 M99 51 C111 47 129 47 141 51"
        detailD="M84 18 L88 49 M156 18 L152 49 M80 55 C103 60 138 60 162 55"
      />
      <path className="avatar-kitty-inner avatar-outline" d="M86 24 L89 45 L101 43 Z M154 24 L151 45 L139 43 Z" fill="#f58fb3" stroke={palette.hat.outline} strokeWidth="1.2" />
      <path className="avatar-kitty-headband avatar-outline" d="M78 52 C101 58 140 58 163 52 L162 61 C140 67 101 67 79 61 Z" fill={paints.hat} stroke={palette.hat.outline} strokeWidth="2.1" />
      <path className="avatar-kitty-bow-left avatar-outline" d="M112 48 C103 39 91 40 90 50 C91 59 103 61 114 54 Z" fill="#f56db2" stroke={palette.hat.outline} strokeWidth="1.8" strokeLinejoin="round" />
      <path className="avatar-kitty-bow-right avatar-outline" d="M128 48 C137 39 149 40 150 50 C149 59 137 61 126 54 Z" fill="#f56db2" stroke={palette.hat.outline} strokeWidth="1.8" strokeLinejoin="round" />
      <path className="avatar-kitty-bow-knot avatar-outline" d="M113 48 C117 44 123 44 127 48 L126 56 C122 59 117 58 114 55 Z" fill="#ffd0e8" stroke={palette.hat.outline} strokeWidth="1.5" />
      <path className="avatar-kitty-bow-highlight avatar-highlight" d="M95 48 C100 44 106 46 110 50 M132 50 C137 45 143 45 147 49" fill="none" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round" opacity="0.72" />
    </g>
  );
}

function MischiefHood({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hat:mischief_hood" data-avatar-skull-anchor={AVATAR_HEADWEAR_ANCHORS.skullTop.y} data-hair-coverage="occludes" data-hat-tone={config.hat_color || palette.hat.base}>
      <HatFinish
        palette={palette}
        paints={paints}
        baseD="M68 116 C56 129 53 145 59 159 C80 150 97 146 114 149 C133 145 154 150 181 159 C186 144 180 128 169 116 C148 124 91 124 68 116 Z"
        shadowD="M62 144 C84 137 103 138 119 143 C140 137 160 142 178 151 L181 159 C153 150 133 147 114 149 C97 146 80 150 59 159 Z"
        highlightD="M67 130 C82 124 96 124 108 128 M138 127 C151 125 164 131 173 139"
        detailD="M65 145 C83 139 99 140 114 145 M132 143 C148 140 162 145 177 152"
      />
      <path
        className="avatar-hood-occluder avatar-outline"
        d="M78 46 L80 14 L103 34 C108 23 115 17 121 17 C128 17 135 23 139 34 L160 14 L162 47 C172 58 178 75 177 94 C176 114 171 130 166 140 C154 129 146 124 137 127 C127 133 112 133 102 127 C93 124 85 129 74 140 C67 125 63 108 64 90 C65 72 69 57 78 46 Z M120 52 C140 51 155 65 158 84 C161 103 153 121 139 130 C130 137 111 137 101 130 C87 121 80 103 83 84 C86 65 100 51 120 52 Z"
        fill={paints.hat}
        fillRule="evenodd"
        clipRule="evenodd"
        stroke={palette.hat.outline}
        strokeWidth="3.1"
        strokeLinejoin="round"
      />
      <path className="avatar-mischief-ear avatar-hat-panel" d="M82 21 L84 48 L101 37 Z M158 21 L156 48 L140 37 Z" fill={palette.hat.deep} opacity="0.72" />
      <path className="avatar-mischief-ear-inner avatar-outline" d="M85 25 L88 42 L98 36 Z M155 25 L152 42 L142 36 Z" fill="#e76bcb" stroke={palette.hat.outline} strokeWidth="1.1" />
      <path className="avatar-hood-rim avatar-outline" d="M120 50 C99 50 84 66 81 85 C78 104 87 123 101 132 M120 50 C141 50 156 66 159 85 C162 104 153 123 139 132" fill="none" stroke={palette.hat.light} strokeWidth="4.5" strokeLinecap="round" />
      <path className="avatar-hood-rim avatar-highlight" d="M91 73 C97 60 108 55 119 54 M143 61 C150 69 154 79 154 90" fill="none" stroke={palette.hat.highlight} strokeWidth="1.7" strokeLinecap="round" />
      <path className="avatar-mischief-stitch avatar-detail" d="M73 111 C81 124 90 132 101 136 M167 111 C159 124 150 132 139 136" fill="none" stroke="#e76bcb" strokeWidth="1.5" strokeDasharray="3 3" strokeLinecap="round" />
      <path className="avatar-mischief-clasp avatar-outline" d="M111 137 L120 130 L129 137 L126 147 L114 147 Z" fill="#9d64eb" stroke={palette.hat.outline} strokeWidth="1.4" />
      <path className="avatar-mischief-mark avatar-highlight" d="M116 138 L120 134 L124 138 L120 143 Z" fill="#ff75d8" stroke={palette.hat.outline} strokeWidth="0.7" />
    </g>
  );
}

export const HAT_RENDERERS = Object.freeze({
  none: EmptyPart,
  crown: Crown,
  wizard: WizardHat,
  beanie: Beanie,
  cap: Cap,
  pirate: PirateHat,
  headphones: Headphones,
  tiara: Tiara,
  horns: Horns,
  bunny_ears: BunnyEars,
  cat_ears: CatEars,
  halo: Halo,
  viking: VikingHelmet,
  star_headset: StarHeadset,
  hunter_hood: HunterHood,
  kitty_bow_ears: KittyBowEars,
  mischief_hood: MischiefHood,
});
