function HairFinish({
  palette,
  paints,
  baseD,
  shadowD,
  highlightD,
  strandD,
  detailD,
  strokeWidth = 3.2,
}) {
  return (
    <g className="avatar-hair-finish">
      <path
        className="avatar-hair-base avatar-hair-silhouette avatar-hair-lock avatar-hair-plane avatar-outline"
        d={baseD}
        fill={paints.hair}
        stroke={palette.hair.outline}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        className="avatar-hair-shadow avatar-hair-root-shadow avatar-hair-plane"
        d={shadowD}
        fill={palette.hair.deep}
        opacity="0.7"
      />
      <path
        className="avatar-hair-directional-highlight avatar-highlight"
        d={highlightD}
        fill="none"
        stroke={palette.hair.lifted}
        strokeWidth="2.15"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.78"
      />
      <path
        className="avatar-hair-strand avatar-detail"
        d={strandD}
        fill="none"
        stroke={palette.hair.shadow}
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.84"
      />
      <path
        className="avatar-hair-boundary avatar-detail"
        d={detailD}
        fill="none"
        stroke={palette.hair.outline}
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.76"
      />
    </g>
  );
}

function EmptyHairPart({ config, palette }) {
  void config;
  void palette;
  return null;
}

export function ShortHairFront({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hair:short:front" data-hair-tone={config.hair_color || palette.hair.base}>
      <HairFinish
        palette={palette}
        paints={paints}
        baseD="M77 84 C71 76 70 67 74 59 C68 59 64 56 61 52 C72 53 82 48 89 41 C81 43 74 39 71 34 C83 37 96 33 104 25 C97 27 92 22 90 17 C101 22 111 20 118 12 C124 20 133 23 142 24 C153 25 160 32 162 42 C170 43 174 48 177 56 C170 53 164 55 160 60 C166 68 164 77 157 86 C154 76 151 67 146 59 C139 53 133 54 128 61 C124 68 121 79 116 86 C119 73 116 62 110 57 C102 52 94 59 90 67 L83 84 Z"
        shadowD="M91 35 C106 24 126 22 142 29 C151 33 158 42 160 52 C151 46 141 44 131 45 C112 41 94 47 82 61 C83 50 87 42 91 35 Z M78 62 C85 61 90 65 92 70 L83 84 C80 77 78 70 78 62 Z M145 58 C153 65 156 75 157 86 C151 79 148 70 145 58 Z"
        highlightD="M83 49 C91 41 99 36 107 32 M114 27 C121 25 128 27 134 30 M139 31 C146 34 151 39 154 44"
        strandD="M88 55 C96 49 103 46 109 43 M116 36 C124 32 133 34 139 38 M143 47 C150 49 154 54 157 59"
        detailD="M107 31 C101 42 91 53 80 59 M131 28 C121 35 111 42 101 46 M153 39 C145 42 136 47 128 53 M97 59 C91 67 87 76 84 82"
      />
      <path className="avatar-brow-window avatar-brow-window-left avatar-detail" d="M96 60 C102 56 108 55 113 58" fill="none" stroke={palette.hair.shadow} strokeWidth="1.2" strokeLinecap="round" opacity="0.66" />
      <path className="avatar-brow-window avatar-brow-window-right avatar-detail" d="M129 60 C135 55 142 55 147 59" fill="none" stroke={palette.hair.shadow} strokeWidth="1.2" strokeLinecap="round" opacity="0.66" />
    </g>
  );
}

function LongHairRear({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hair:long:rear" data-hair-tone={config.hair_color || palette.hair.base}>
      <HairFinish
        palette={palette}
        paints={paints}
        baseD="M79 51 C67 64 64 84 68 105 C70 125 65 142 58 154 C73 158 88 151 96 139 C105 151 136 153 146 138 C154 152 170 158 184 151 C175 136 171 119 174 101 C178 79 171 59 158 48 C138 31 99 32 79 51 Z"
        shadowD="M69 89 C76 104 76 129 65 148 C78 149 87 140 92 126 L94 73 Z M149 69 L151 128 C158 143 168 149 179 147 C168 128 167 106 173 88 C166 74 158 68 149 69 Z"
        highlightD="M80 58 C73 77 77 104 75 124 M92 48 C85 65 87 92 84 112 M105 42 C98 55 98 71 99 87"
        strandD="M73 70 C82 91 80 119 72 139 M89 58 C96 83 94 112 84 137 M158 58 C150 85 153 116 166 140"
        detailD="M94 48 C86 80 93 119 96 139 M148 48 C157 80 149 116 146 138 M106 43 C111 80 107 119 102 145"
      />
    </g>
  );
}

function LongHairFront({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hair:long:front" data-hair-tone={config.hair_color || palette.hair.base}>
      <HairFinish
        palette={palette}
        paints={paints}
        baseD="M75 74 C72 50 88 29 110 24 C131 18 154 28 164 47 C169 57 168 68 163 79 L154 66 C146 56 138 48 127 43 C119 53 108 61 96 66 L86 93 C79 89 75 83 75 74 Z M153 63 C162 73 166 89 161 105 C156 100 151 94 148 87 Z"
        shadowD="M124 28 C143 29 158 41 163 57 C153 51 143 46 128 43 C121 50 115 55 108 59 C112 45 117 35 124 28 Z M79 66 C84 62 90 63 96 66 L86 93 C80 87 77 78 79 66 Z"
        highlightD="M86 47 C94 38 104 33 114 30 M99 55 C108 49 116 43 122 35 M138 34 C147 38 154 44 157 51"
        strandD="M82 59 C91 55 98 55 104 57 M113 49 C120 43 126 37 130 31 M145 45 C153 50 158 58 160 67"
        detailD="M127 43 C118 54 107 62 96 66 M95 66 C90 75 88 84 86 92 M153 63 C156 76 157 91 161 104"
      />
    </g>
  );
}

function SpikyHairFront({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hair:spiky:front" data-hair-tone={config.hair_color || palette.hair.base}>
      <HairFinish
        palette={palette}
        paints={paints}
        baseD="M73 82 L68 61 L55 63 L68 49 L57 41 L78 39 L70 24 L94 31 L93 14 L111 27 L120 10 L129 27 L148 14 L146 32 L170 24 L162 43 L181 47 L166 59 L178 70 L158 70 L155 87 C149 75 145 65 138 58 C132 52 126 51 121 60 L115 80 C114 66 108 58 99 58 C91 60 86 70 82 84 Z"
        shadowD="M73 53 C91 39 107 33 122 32 C139 31 154 39 165 53 L157 68 C149 57 136 49 122 48 C105 46 88 54 79 69 Z"
        highlightD="M74 43 L91 39 M96 29 L108 34 M122 22 L124 34 M144 27 L138 37 M160 38 L150 43"
        strandD="M82 52 L96 46 M104 39 L114 43 M127 38 L137 41 M147 47 L158 54"
        detailD="M79 68 C91 55 105 48 121 48 M121 48 C135 48 148 55 157 68 M99 58 C108 54 116 58 121 65"
      />
    </g>
  );
}

function CurlyHairFront({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hair:curly:front" data-hair-tone={config.hair_color || palette.hair.base}>
      <HairFinish
        palette={palette}
        paints={paints}
        baseD="M72 85 C61 80 61 66 70 60 C61 50 67 37 79 36 C77 23 90 17 100 24 C106 11 122 10 130 21 C141 13 155 21 154 34 C167 34 174 46 166 57 C178 63 177 77 167 83 C161 88 157 89 153 87 C151 75 146 66 138 61 C132 57 126 59 123 67 L118 84 C115 70 109 62 100 62 C90 63 85 74 81 87 Z"
        shadowD="M70 60 C81 53 91 51 102 54 C113 47 126 47 137 54 C151 51 162 57 168 68 C165 78 160 84 153 87 C149 74 143 64 134 61 C127 59 123 66 119 78 C115 68 108 61 99 62 C89 64 84 75 81 87 C73 84 69 75 70 60 Z"
        highlightD="M76 46 C82 39 89 38 95 42 M101 29 C108 22 117 23 122 30 M134 28 C142 24 149 30 149 38"
        strandD="M76 59 C84 54 92 57 93 64 C94 70 88 73 83 70 M105 46 C113 40 122 45 121 52 C120 58 112 60 107 55 M139 47 C147 42 156 48 154 56"
        detailD="M68 70 C73 63 80 62 86 67 M94 39 C98 34 106 34 111 39 M127 35 C133 31 140 34 143 40 M154 62 C161 59 168 65 167 72"
      />
      <circle cx="76" cy="72" r="5.4" fill="none" stroke={palette.hair.outline} strokeWidth="1.4" opacity="0.7" />
      <circle cx="156" cy="58" r="5" fill="none" stroke={palette.hair.shadow} strokeWidth="1.3" opacity="0.7" />
    </g>
  );
}

function MohawkHairFront({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hair:mohawk:front" data-hair-tone={config.hair_color || palette.hair.base}>
      <HairFinish
        palette={palette}
        paints={paints}
        baseD="M91 64 C92 47 99 37 108 31 L105 19 L116 25 L121 12 L128 25 L139 17 L138 34 C147 41 152 51 151 66 C143 58 134 54 123 54 C111 54 101 58 91 64 Z"
        shadowD="M119 26 C128 27 137 34 141 43 C132 39 123 38 114 41 C107 43 101 48 96 56 C100 42 108 31 119 26 Z"
        highlightD="M114 29 L120 20 M125 30 L129 23 M132 35 L136 27"
        strandD="M108 40 C116 34 126 34 134 39 M104 49 C114 43 128 43 140 49"
        detailD="M96 57 C109 50 126 48 145 57 M120 27 C118 37 119 46 123 54"
      />
      <path className="avatar-hair-fade avatar-detail" d="M81 58 C78 65 78 73 80 80 M160 58 C163 66 163 74 160 81" fill="none" stroke={palette.hair.shadow} strokeWidth="3" strokeDasharray="1 3" strokeLinecap="round" opacity="0.68" />
    </g>
  );
}

function BuzzHairFront({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hair:buzz:front" data-hair-tone={config.hair_color || palette.hair.base}>
      <HairFinish
        palette={palette}
        paints={paints}
        baseD="M78 69 C77 45 94 29 119 28 C144 27 162 43 163 68 C153 60 139 55 121 55 C103 55 89 60 78 69 Z"
        shadowD="M80 59 C91 49 105 44 121 44 C139 44 152 49 160 59 L162 68 C149 59 135 55 120 55 C103 55 89 60 78 69 Z"
        highlightD="M91 44 C101 36 114 34 125 35 M132 36 C142 38 150 43 154 49"
        strandD="M88 52 L92 50 M98 46 L102 44 M109 42 L113 40 M121 40 L125 39 M135 42 L139 44 M147 48 L151 51"
        detailD="M79 62 C91 54 105 50 120 50 C137 50 151 54 161 63"
      />
      <path className="avatar-hair-stubble avatar-detail" d="M84 59 L86 62 M94 52 L96 55 M106 48 L108 51 M119 46 L121 49 M133 48 L135 51 M146 52 L148 55 M155 59 L157 62" fill="none" stroke={palette.hair.outline} strokeWidth="1.2" strokeLinecap="round" opacity="0.72" />
    </g>
  );
}

function PonytailHairRear({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hair:ponytail:rear" data-hair-tone={config.hair_color || palette.hair.base}>
      <HairFinish
        palette={palette}
        paints={paints}
        baseD="M151 47 C169 43 184 53 185 68 C199 75 198 93 188 102 C195 115 188 132 176 139 C167 144 158 138 158 128 C168 120 169 110 163 101 C174 91 172 79 161 75 C164 63 158 54 151 47 Z"
        shadowD="M177 68 C188 78 188 90 180 100 C188 112 183 126 174 133 C167 137 162 132 163 126 C172 117 171 108 166 100 C174 91 172 80 164 75 Z"
        highlightD="M161 54 C174 56 180 64 180 74 M175 104 C181 113 178 122 171 128"
        strandD="M166 61 C180 68 181 81 174 91 M171 98 C182 108 181 121 171 132"
        detailD="M161 75 C171 79 176 88 174 98 M164 101 C171 110 170 120 163 127"
      />
      <path className="avatar-hair-tie avatar-outline" d="M153 61 C160 59 167 63 168 69 C166 75 160 78 154 75 Z" fill={palette.hair.light} stroke={palette.hair.outline} strokeWidth="1.5" />
    </g>
  );
}

function PonytailHairFront({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hair:ponytail:front" data-hair-tone={config.hair_color || palette.hair.base}>
      <HairFinish
        palette={palette}
        paints={paints}
        baseD="M77 78 C72 53 88 31 111 25 C132 19 153 28 163 46 C168 55 167 65 162 74 C153 61 140 51 126 46 C114 54 100 60 84 64 L82 87 C78 84 76 81 77 78 Z"
        shadowD="M125 29 C143 30 157 41 162 56 C151 50 140 47 126 46 C115 53 102 59 87 63 C97 45 108 34 125 29 Z"
        highlightD="M89 47 C99 38 110 33 120 31 M128 31 C140 33 150 40 155 48"
        strandD="M92 55 C105 49 116 43 124 36 M136 39 C146 43 153 49 158 57"
        detailD="M126 46 C115 55 101 61 84 64 M84 64 C82 72 82 80 82 87"
      />
    </g>
  );
}

function BunHairRear({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hair:bun:rear" data-hair-tone={config.hair_color || palette.hair.base}>
      <HairFinish
        palette={palette}
        paints={paints}
        baseD="M96 39 C87 27 91 14 104 12 C108 2 123 -1 131 7 C143 5 152 15 148 27 C155 34 150 45 140 49 Z M83 66 C73 86 74 113 86 137 C94 132 99 122 98 107 L96 69 Z M145 67 L143 108 C143 124 149 134 157 138 C168 112 167 86 157 67 Z"
        shadowD="M105 15 C115 8 130 9 139 18 C145 24 143 34 137 40 C129 35 118 32 106 34 C99 29 99 21 105 15 Z M88 75 C83 94 85 115 92 128 C97 116 97 94 94 75 Z M150 75 C146 97 147 117 154 129 C161 108 161 90 156 75 Z"
        highlightD="M103 17 C111 11 122 10 130 13 M94 73 C89 88 90 103 92 115 M151 73 C155 88 155 103 153 115"
        strandD="M103 29 C113 21 128 20 139 27 M88 84 C94 97 94 113 91 127 M154 83 C149 99 150 115 155 129"
        detailD="M103 35 C115 30 129 32 140 40 M96 70 C90 92 94 116 98 127 M145 70 C151 94 147 116 143 128"
      />
    </g>
  );
}

function BunHairFront({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hair:bun:front" data-hair-tone={config.hair_color || palette.hair.base}>
      <HairFinish
        palette={palette}
        paints={paints}
        baseD="M79 76 C75 52 91 32 113 27 C133 22 153 31 161 49 C165 57 164 66 160 75 C151 61 140 53 125 48 C112 52 99 58 84 66 L83 87 C79 84 78 80 79 76 Z"
        shadowD="M125 31 C142 32 155 42 160 57 C148 51 137 48 125 48 C111 52 99 58 87 64 C96 46 108 35 125 31 Z"
        highlightD="M91 47 C102 38 115 34 126 34 M136 36 C146 40 153 46 157 53"
        strandD="M94 56 C105 50 116 45 124 38 M137 44 C145 48 152 54 158 62"
        detailD="M125 48 C112 53 98 60 84 66 M84 66 C83 74 83 81 83 87"
      />
    </g>
  );
}

function PigtailsHairRear({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hair:pigtails:rear" data-hair-tone={config.hair_color || palette.hair.base}>
      <HairFinish
        palette={palette}
        paints={paints}
        baseD="M79 58 C62 56 50 68 54 82 C42 91 46 107 59 112 C48 126 57 143 72 145 C84 146 91 135 85 125 C96 113 94 96 83 88 C89 76 86 65 79 58 Z M160 58 C177 56 190 68 186 82 C198 91 194 107 181 112 C192 126 183 143 168 145 C156 146 149 135 155 125 C144 113 146 96 157 88 C151 76 153 65 160 58 Z"
        shadowD="M64 75 C54 84 58 94 67 98 C57 109 62 125 74 130 C81 133 86 128 84 123 C92 111 90 99 81 91 C86 80 80 72 64 75 Z M176 75 C186 84 182 94 173 98 C183 109 178 125 166 130 C159 133 154 128 156 123 C148 111 150 99 159 91 C154 80 160 72 176 75 Z"
        highlightD="M61 72 C54 80 55 89 63 94 M57 112 C59 124 65 132 73 135 M179 73 C185 82 183 90 176 95"
        strandD="M69 63 C81 72 81 82 75 91 M65 99 C78 107 80 120 73 132 M171 63 C159 72 159 82 165 91 M175 99 C162 107 160 120 167 132"
        detailD="M83 88 C75 96 76 109 84 122 M157 88 C165 96 164 109 156 122"
      />
      <path className="avatar-hair-tie avatar-outline" d="M76 65 C82 63 88 67 88 73 C86 78 80 80 75 77 Z M164 65 C158 63 152 67 152 73 C154 78 160 80 165 77 Z" fill={palette.hair.light} stroke={palette.hair.outline} strokeWidth="1.4" />
    </g>
  );
}

function PigtailsHairFront({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hair:pigtails:front" data-hair-tone={config.hair_color || palette.hair.base}>
      <HairFinish
        palette={palette}
        paints={paints}
        baseD="M76 78 C72 53 88 32 111 26 C133 20 154 30 164 49 C168 58 166 68 161 76 C153 64 141 55 122 48 C104 55 91 63 81 76 L82 88 C78 85 76 82 76 78 Z"
        shadowD="M121 30 C141 31 157 42 162 58 C149 52 136 49 122 48 C107 53 94 61 83 72 C89 49 102 35 121 30 Z"
        highlightD="M88 49 C97 40 108 35 118 33 M130 33 C142 36 152 43 157 51"
        strandD="M95 55 C105 49 114 44 121 37 M127 38 C136 43 145 48 153 56"
        detailD="M122 48 C109 54 96 61 83 72 M122 48 C136 52 149 60 161 76"
      />
      <path className="avatar-hair-part avatar-detail" d="M121 31 C119 39 120 44 122 48" fill="none" stroke={palette.hair.outline} strokeWidth="1.8" strokeLinecap="round" />
    </g>
  );
}

function AfroHairRear({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hair:afro:rear" data-hair-tone={config.hair_color || palette.hair.base}>
      <HairFinish
        palette={palette}
        paints={paints}
        baseD="M75 130 C59 128 50 115 57 101 C42 94 41 77 53 68 C43 55 50 40 65 38 C62 23 75 13 89 19 C95 5 112 2 122 13 C134 2 151 8 155 22 C170 18 181 30 178 45 C193 50 197 66 186 77 C198 89 193 105 179 110 C184 126 171 139 156 136 C147 148 133 151 121 142 C109 151 91 148 84 136 C80 134 77 132 75 130 Z"
        shadowD="M60 80 C70 55 91 40 118 38 C147 36 173 53 184 79 C190 96 181 111 168 117 C161 134 143 143 124 137 C105 145 87 135 80 119 C64 113 54 98 60 80 Z"
        highlightD="M67 57 C77 42 91 35 104 34 M94 22 C104 15 116 16 123 23 M135 20 C147 20 155 28 158 38"
        strandD="M67 74 C77 62 91 58 103 63 C111 50 130 48 141 60 C153 53 168 60 173 72"
        detailD="M57 94 C68 85 80 86 88 95 M86 122 C98 113 112 116 120 126 M139 119 C151 111 165 115 171 125 M159 89 C170 82 183 87 186 97"
      />
    </g>
  );
}

function AfroHairFront({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hair:afro:front" data-hair-tone={config.hair_color || palette.hair.base}>
      <HairFinish
        palette={palette}
        paints={paints}
        baseD="M71 87 C59 82 60 68 69 62 C60 51 68 39 80 39 C80 26 93 20 103 27 C110 15 126 15 134 26 C146 20 159 28 157 41 C170 42 176 55 168 65 C178 74 173 87 162 91 C156 78 149 67 139 62 C132 58 126 62 122 70 L117 86 C114 72 107 63 98 64 C88 66 83 77 80 89 Z"
        shadowD="M69 65 C83 55 99 53 115 59 C131 51 151 56 166 67 C169 76 166 85 162 91 C155 77 147 67 137 62 C129 59 124 66 120 78 C114 68 107 63 98 64 C88 66 83 77 80 89 C73 85 69 77 69 65 Z"
        highlightD="M77 50 C86 42 96 42 104 47 M108 32 C117 25 128 28 133 37 M143 34 C152 34 158 42 158 50"
        strandD="M76 64 C85 58 95 60 99 68 M105 53 C115 47 128 49 134 58 M143 53 C153 49 162 56 163 65"
        detailD="M70 75 C78 69 87 70 92 77 M95 41 C102 36 110 38 114 44 M128 42 C136 37 145 41 148 48 M151 72 C159 67 167 72 169 79"
      />
    </g>
  );
}

function BraidsHairRear({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hair:braids:rear" data-hair-tone={config.hair_color || palette.hair.base}>
      <HairFinish
        palette={palette}
        paints={paints}
        baseD="M79 58 C68 71 68 88 76 100 C66 111 68 126 78 134 C68 145 74 159 87 161 C98 158 100 146 93 138 C103 125 101 110 92 101 C101 86 97 67 86 58 Z M154 58 C143 71 139 88 148 101 C139 112 138 127 148 138 C141 147 143 159 154 162 C168 159 173 146 162 135 C172 122 172 108 162 99 C171 84 169 68 161 58 Z"
        shadowD="M80 70 C75 83 78 92 84 101 C77 111 79 124 87 132 C80 141 82 151 89 155 C95 150 95 143 90 137 C98 123 96 111 88 101 C96 86 92 75 86 69 Z M157 70 C164 82 163 91 156 100 C165 111 165 124 156 136 C164 145 161 154 154 157 C148 151 149 144 153 138 C145 123 145 112 153 101 C145 87 149 76 157 70 Z"
        highlightD="M79 72 C75 82 77 91 83 98 M78 113 C76 123 81 130 87 134 M153 72 C149 82 151 91 157 98"
        strandD="M84 63 L78 77 L89 88 L80 101 L92 113 L82 126 L93 139 L86 151 M156 63 L162 77 L151 88 L160 101 L148 113 L158 126 L147 139 L154 152"
        detailD="M78 83 L91 94 M79 108 L94 120 M81 133 L94 144 M162 83 L149 94 M161 108 L146 120 M159 133 L146 144"
      />
      <circle className="avatar-hair-bead avatar-highlight" cx="88" cy="154" r="3" fill={palette.hair.light} stroke={palette.hair.outline} strokeWidth="1.2" />
      <circle className="avatar-hair-bead avatar-highlight" cx="153" cy="155" r="3" fill={palette.hair.light} stroke={palette.hair.outline} strokeWidth="1.2" />
    </g>
  );
}

function BraidsHairFront({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hair:braids:front" data-hair-tone={config.hair_color || palette.hair.base}>
      <HairFinish
        palette={palette}
        paints={paints}
        baseD="M78 78 C74 53 90 33 112 27 C134 21 155 31 163 50 C167 59 165 69 160 77 C151 62 137 53 121 50 C105 53 91 63 82 77 L82 88 C79 85 78 82 78 78 Z"
        shadowD="M121 31 C141 31 156 43 161 59 C148 53 135 50 121 50 C106 54 93 62 83 74 C89 50 102 35 121 31 Z"
        highlightD="M90 49 C100 40 110 36 120 34 M131 35 C142 38 151 44 156 52"
        strandD="M94 56 C102 49 110 44 119 39 M104 61 C111 54 116 48 121 41 M133 42 C141 47 148 52 153 59"
        detailD="M86 66 C98 57 110 52 121 50 M121 50 C135 53 148 61 160 77 M101 39 C107 46 109 53 108 58"
      />
      <path className="avatar-cornrow avatar-detail" d="M97 42 C102 48 104 54 103 60 M108 36 C113 43 115 49 114 54 M122 33 C126 39 128 44 128 51 M136 37 C139 42 140 47 139 53" fill="none" stroke={palette.hair.outline} strokeWidth="1.45" strokeLinecap="round" />
    </g>
  );
}

function WavyHairRear({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hair:wavy:rear" data-hair-tone={config.hair_color || palette.hair.base}>
      <HairFinish
        palette={palette}
        paints={paints}
        baseD="M79 50 C65 67 64 86 73 103 C61 115 64 132 76 143 C68 151 73 162 85 164 C97 162 102 150 95 141 C106 126 103 107 93 96 C102 80 97 61 87 51 Z M153 49 C143 64 140 82 149 97 C138 110 137 128 148 142 C140 152 145 163 157 164 C170 160 175 147 166 138 C177 123 176 106 165 95 C174 79 169 62 160 51 Z"
        shadowD="M77 75 C70 90 76 101 83 109 C73 119 77 134 87 142 C82 151 84 157 89 158 C97 151 95 143 90 137 C100 124 97 109 87 99 C96 85 91 73 84 67 Z M159 69 C166 82 162 92 155 100 C164 111 164 124 154 137 C162 145 160 154 155 158 C147 151 149 143 154 137 C144 124 146 109 155 99 C146 85 151 75 159 69 Z"
        highlightD="M77 58 C70 72 72 84 79 94 M72 112 C67 126 73 137 82 143 M157 57 C164 71 162 84 156 94"
        strandD="M84 58 C74 76 79 91 89 99 C77 113 79 127 90 138 M155 58 C166 75 162 89 153 99 C164 112 162 127 151 138"
        detailD="M74 97 C82 102 87 107 88 114 M166 96 C158 102 153 108 152 115 M80 145 C87 149 91 154 89 160"
      />
    </g>
  );
}

function WavyHairFront({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hair:wavy:front" data-hair-tone={config.hair_color || palette.hair.base}>
      <HairFinish
        palette={palette}
        paints={paints}
        baseD="M75 79 C71 55 86 34 108 27 C131 20 154 30 164 50 C169 60 166 71 160 80 C154 68 145 60 133 54 C126 51 121 54 116 61 C110 69 104 75 95 77 C88 79 85 84 82 91 C78 88 75 84 75 79 Z"
        shadowD="M121 31 C141 30 157 42 163 59 C153 53 142 50 132 53 C124 55 119 62 113 68 C106 75 97 77 88 81 C92 60 103 40 121 31 Z"
        highlightD="M87 49 C96 40 107 35 117 33 M128 33 C140 35 150 42 156 50 M97 67 C105 64 111 59 116 53"
        strandD="M83 59 C94 54 104 53 112 56 M121 42 C130 38 142 42 149 49 M129 55 C140 57 149 64 155 73"
        detailD="M88 81 C99 78 108 72 114 65 C120 57 124 52 132 53 M82 66 C86 76 84 84 82 91"
      />
    </g>
  );
}

function SidePartHairFront({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hair:side_part:front" data-hair-tone={config.hair_color || palette.hair.base}>
      <HairFinish
        palette={palette}
        paints={paints}
        baseD="M76 82 C71 59 82 38 103 29 C124 19 150 27 161 47 C168 58 166 72 158 84 C152 69 147 58 136 52 C128 47 120 47 113 52 C104 58 97 65 87 69 L83 88 C79 87 77 84 76 82 Z"
        shadowD="M111 32 C132 25 153 36 161 54 C151 49 141 47 133 50 C122 48 116 50 109 56 C100 63 93 68 86 69 C89 51 97 39 111 32 Z"
        highlightD="M92 48 C101 40 111 35 121 32 M129 32 C141 34 151 41 156 49"
        strandD="M88 59 C99 53 108 48 116 41 M121 38 C133 38 145 44 153 52"
        detailD="M116 30 C116 39 114 47 109 56 M109 56 C101 63 94 68 87 69 M133 50 C144 56 151 68 158 84"
      />
      <path className="avatar-hair-part avatar-detail" d="M116 30 C117 35 117 39 116 43" fill="none" stroke={palette.hair.deep} strokeWidth="2.1" strokeLinecap="round" />
    </g>
  );
}

function FadeHairFront({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hair:fade:front" data-hair-tone={config.hair_color || palette.hair.base}>
      <HairFinish
        palette={palette}
        paints={paints}
        baseD="M83 66 C84 43 99 29 120 27 C142 27 157 41 159 65 C146 57 134 53 121 53 C107 53 95 57 83 66 Z"
        shadowD="M88 54 C97 44 108 39 121 39 C134 39 146 44 154 54 L159 65 C147 58 134 53 121 53 C107 53 95 57 83 66 Z"
        highlightD="M98 39 C107 33 118 31 128 33 M135 34 C143 37 149 42 152 48"
        strandD="M97 49 C105 44 114 42 122 42 M130 43 C138 45 145 49 150 54"
        detailD="M84 60 C96 52 108 49 121 49 C136 49 149 54 158 62"
      />
      <path className="avatar-hair-fade avatar-detail" d="M79 61 C76 68 77 77 81 82 M162 61 C165 69 164 77 160 83" fill="none" stroke={palette.hair.shadow} strokeWidth="3.8" strokeDasharray="1 3" strokeLinecap="round" opacity="0.62" />
      <path className="avatar-hair-fade-line avatar-detail" d="M81 68 C84 65 87 63 90 62 M151 62 C155 63 158 65 161 68" fill="none" stroke={palette.hair.lifted} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    </g>
  );
}

function DreadlocksHairRear({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hair:dreadlocks:rear" data-hair-tone={config.hair_color || palette.hair.base}>
      <HairFinish
        palette={palette}
        paints={paints}
        baseD="M73 55 C63 73 66 92 75 103 C65 119 69 143 82 155 C91 160 99 152 95 143 C99 128 96 111 88 100 C96 82 92 64 84 55 Z M91 48 C84 68 88 91 97 104 C89 123 94 148 107 159 C116 159 120 149 114 141 C120 123 115 104 107 94 C113 75 106 57 99 48 Z M145 49 C137 67 135 86 145 99 C136 117 138 142 150 157 C158 163 167 155 162 146 C169 129 164 110 156 99 C165 81 160 61 153 50 Z M161 55 C153 73 157 93 165 104 C156 121 160 144 173 154 C182 159 190 149 184 140 C189 123 183 108 176 99 C184 82 177 64 168 55 Z"
        shadowD="M78 64 C72 80 77 94 83 102 C74 119 78 140 88 149 C94 149 96 143 92 137 C97 121 93 108 86 99 C93 81 88 69 82 62 Z M99 55 C94 73 99 91 105 98 C97 117 102 139 111 150 C116 145 115 140 111 134 C116 118 111 105 104 95 C110 76 104 62 99 55 Z M153 58 C148 76 151 90 157 99 C150 115 154 137 158 148 C165 141 163 135 160 130 C165 116 161 105 154 96 C161 78 158 65 153 58 Z"
        highlightD="M74 62 C69 78 72 90 79 99 M92 55 C88 70 91 84 98 94 M146 57 C141 72 143 87 150 97"
        strandD="M80 59 C74 79 80 94 86 102 C78 120 82 139 91 148 M98 52 C92 75 100 91 106 98 C99 118 104 138 112 149 M153 54 C146 75 151 91 158 99 C151 119 156 139 159 150 M168 59 C162 79 169 94 175 102 C167 121 172 140 179 149"
        detailD="M76 111 C84 116 90 121 92 128 M96 108 C104 114 110 120 112 127 M147 108 C155 114 160 120 162 127 M164 111 C172 116 178 122 180 129"
      />
      <path className="avatar-hair-band avatar-detail" d="M77 118 L94 124 M99 119 L115 125 M148 119 L164 125 M166 118 L184 124" fill="none" stroke={palette.hair.lifted} strokeWidth="2.2" strokeLinecap="round" opacity="0.72" />
    </g>
  );
}

function DreadlocksHairFront({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hair:dreadlocks:front" data-hair-tone={config.hair_color || palette.hair.base}>
      <HairFinish
        palette={palette}
        paints={paints}
        baseD="M75 79 C71 56 87 34 109 28 C132 21 155 31 164 51 C168 61 165 72 159 81 C152 69 143 60 132 55 C126 51 121 55 116 63 L109 83 C108 69 102 62 94 64 C86 67 83 78 80 89 C77 87 75 83 75 79 Z"
        shadowD="M122 32 C143 31 158 44 163 60 C151 53 141 52 132 55 C124 55 120 62 115 70 C109 64 101 62 94 64 C86 68 82 79 80 89 C77 79 78 65 84 53 C92 42 104 35 122 32 Z"
        highlightD="M86 49 C97 40 108 35 119 34 M129 34 C141 36 151 43 157 52"
        strandD="M89 56 C82 68 86 78 91 84 M103 45 C96 59 100 72 106 80 M119 38 C113 52 117 63 122 70 M137 40 C130 53 135 65 142 72 M151 48 C145 60 149 72 155 79"
        detailD="M83 65 C89 59 96 58 102 63 M109 53 C115 48 122 49 127 55 M135 49 C143 47 151 52 156 59"
      />
    </g>
  );
}

function BobHairRear({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hair:bob:rear" data-hair-tone={config.hair_color || palette.hair.base}>
      <HairFinish
        palette={palette}
        paints={paints}
        baseD="M78 48 C65 66 66 94 72 116 C74 128 84 137 97 135 L104 125 C115 132 132 132 141 124 L148 136 C162 138 171 128 172 115 C176 89 173 64 159 48 C140 29 97 30 78 48 Z"
        shadowD="M72 82 C73 100 75 120 87 130 C94 134 100 130 104 124 L98 67 Z M145 66 L141 124 C147 132 155 134 163 128 C170 115 171 96 169 81 C162 69 154 65 145 66 Z"
        highlightD="M79 56 C72 74 75 94 78 109 M91 47 C84 63 87 84 88 99 M154 50 C163 68 163 90 160 107"
        strandD="M76 68 C84 88 82 112 91 128 M92 53 C101 77 99 105 103 123 M153 56 C145 81 147 108 151 129"
        detailD="M101 43 C95 67 100 100 104 125 M141 44 C147 69 143 101 141 124 M79 117 C87 123 95 126 104 124"
      />
    </g>
  );
}

function BobHairFront({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hair:bob:front" data-hair-tone={config.hair_color || palette.hair.base}>
      <HairFinish
        palette={palette}
        paints={paints}
        baseD="M76 79 C72 54 88 33 111 27 C133 21 154 31 163 50 C167 60 165 72 159 82 L151 70 C146 62 140 56 132 52 C124 58 114 63 104 66 L94 65 C86 69 84 80 82 91 C78 88 76 84 76 79 Z"
        shadowD="M126 31 C144 33 157 44 162 59 C151 52 141 50 132 52 C122 59 113 64 104 66 C96 63 89 66 84 74 C87 51 101 36 126 31 Z"
        highlightD="M89 48 C99 40 109 35 120 33 M132 34 C143 38 151 44 156 52"
        strandD="M92 57 C103 51 114 45 124 37 M136 44 C145 48 152 55 157 63"
        detailD="M132 52 C123 59 113 64 104 66 M94 65 C88 72 85 82 82 91 M151 70 C154 75 157 79 159 82"
      />
      <path className="avatar-bob-tip avatar-detail" d="M81 87 C85 92 90 94 95 92 M149 88 C154 92 159 91 162 87" fill="none" stroke={palette.hair.outline} strokeWidth="1.7" strokeLinecap="round" />
    </g>
  );
}

function ShoulderHairRear({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hair:shoulder:rear" data-hair-tone={config.hair_color || palette.hair.base}>
      <HairFinish
        palette={palette}
        paints={paints}
        baseD="M78 50 C65 69 67 96 71 120 C73 137 66 149 59 158 C73 164 88 159 98 148 C109 156 132 157 143 147 C153 158 169 163 182 157 C174 145 169 134 171 118 C175 94 174 69 160 49 C141 29 98 30 78 50 Z"
        shadowD="M71 86 C77 104 77 132 65 153 C78 157 90 149 96 137 L96 70 Z M147 69 L145 138 C152 150 164 157 177 153 C167 133 166 105 172 86 C165 73 157 68 147 69 Z"
        highlightD="M78 59 C72 78 75 100 74 119 M91 49 C84 69 88 94 86 113 M155 53 C163 72 161 98 164 116"
        strandD="M76 70 C85 95 80 125 71 148 M92 57 C100 84 96 117 87 145 M153 58 C145 87 149 121 166 148"
        detailD="M96 48 C90 78 95 115 98 148 M144 47 C151 80 147 115 143 147 M61 157 C75 158 87 151 96 138"
      />
    </g>
  );
}

function ShoulderHairFront({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hair:shoulder:front" data-hair-tone={config.hair_color || palette.hair.base}>
      <HairFinish
        palette={palette}
        paints={paints}
        baseD="M76 79 C72 54 87 33 109 27 C131 20 154 30 164 50 C169 60 166 72 160 81 C153 68 144 59 132 53 C126 50 121 53 116 61 C111 68 104 74 95 77 C87 79 84 86 82 93 C78 90 76 85 76 79 Z"
        shadowD="M122 31 C142 30 158 42 163 59 C151 53 141 51 132 53 C124 54 120 61 115 68 C107 76 99 77 89 81 C91 58 104 39 122 31 Z"
        highlightD="M88 49 C98 40 108 35 118 33 M129 33 C141 36 151 42 157 51"
        strandD="M84 58 C95 54 105 54 113 57 M120 44 C130 39 142 42 150 50 M127 57 C141 60 150 67 156 76"
        detailD="M89 81 C101 78 109 72 115 65 C121 57 124 52 132 53 M82 68 C86 78 84 87 82 93"
      />
    </g>
  );
}

function UndercutHairFront({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hair:undercut:front" data-hair-tone={config.hair_color || palette.hair.base}>
      <HairFinish
        palette={palette}
        paints={paints}
        baseD="M83 69 C82 45 98 29 120 27 C141 25 159 39 162 59 C164 69 160 79 154 87 C151 70 145 58 134 52 C125 47 116 48 108 54 C100 60 94 65 83 69 Z"
        shadowD="M105 36 C122 26 143 32 155 47 C160 54 162 62 159 71 C151 58 142 51 133 49 C123 46 115 49 108 54 C99 61 92 66 83 69 C86 54 93 43 105 36 Z"
        highlightD="M103 39 C113 33 124 31 134 33 M140 35 C149 39 155 45 158 52"
        strandD="M101 50 C112 43 124 39 136 41 M113 57 C125 49 138 48 149 54"
        detailD="M108 54 C100 61 92 66 83 69 M133 49 C145 56 151 68 154 87"
      />
      <path className="avatar-undercut-shave avatar-detail" d="M78 61 C75 69 76 79 81 85 M81 65 L85 68 M79 72 L84 75 M80 79 L84 81" fill="none" stroke={palette.hair.shadow} strokeWidth="1.8" strokeLinecap="round" opacity="0.72" />
      <path className="avatar-undercut-line avatar-highlight" d="M84 55 C87 60 88 64 87 68" fill="none" stroke={palette.hair.lifted} strokeWidth="1.4" strokeLinecap="round" />
    </g>
  );
}

function TwinBunsHairRear({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hair:twin_buns:rear" data-hair-tone={config.hair_color || palette.hair.base}>
      <HairFinish
        palette={palette}
        paints={paints}
        baseD="M76 45 C63 43 55 32 60 21 C65 10 81 9 89 18 C98 25 94 40 82 46 Z M158 45 C146 40 142 25 151 18 C159 9 175 10 181 21 C186 33 177 44 164 46 Z M81 62 C72 79 74 105 85 132 C94 129 99 118 96 105 L94 66 Z M146 66 L144 105 C142 119 148 129 157 133 C168 105 169 79 159 62 Z"
        shadowD="M65 23 C70 14 82 14 88 22 C93 29 89 37 82 40 C74 40 66 34 65 23 Z M175 23 C170 14 158 14 152 22 C147 29 151 37 158 40 C166 40 174 34 175 23 Z M87 72 C82 90 86 112 91 124 C97 111 96 88 93 72 Z M153 72 C158 91 154 112 149 124 C143 111 144 88 147 72 Z"
        highlightD="M66 21 C72 15 80 15 86 20 M154 20 C160 15 169 16 174 22 M92 73 C87 87 88 101 91 112"
        strandD="M67 30 C74 22 84 22 90 29 M150 29 C156 22 166 22 173 30 M87 83 C94 96 94 111 90 124 M153 83 C146 96 146 111 150 124"
        detailD="M62 34 C71 39 79 40 86 37 M178 34 C169 39 161 40 154 37 M94 66 C89 87 94 111 96 125 M146 66 C151 87 146 111 144 125"
      />
    </g>
  );
}

function TwinBunsHairFront({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hair:twin_buns:front" data-hair-tone={config.hair_color || palette.hair.base}>
      <HairFinish
        palette={palette}
        paints={paints}
        baseD="M77 79 C73 54 89 33 111 27 C133 21 154 31 163 50 C167 60 165 70 160 79 C151 65 138 55 121 50 C105 54 92 63 82 77 L82 90 C78 87 77 83 77 79 Z"
        shadowD="M121 31 C141 31 156 43 161 59 C149 53 135 50 121 50 C107 54 94 62 83 74 C89 50 102 35 121 31 Z"
        highlightD="M89 49 C99 40 110 36 119 34 M132 35 C143 38 152 44 157 52"
        strandD="M94 56 C104 50 113 44 120 38 M128 39 C137 44 146 50 153 57"
        detailD="M121 31 C120 39 120 45 121 50 M121 50 C108 54 95 62 83 74 M121 50 C136 53 149 62 160 79"
      />
      <path className="avatar-hair-part avatar-detail" d="M121 31 L121 50" fill="none" stroke={palette.hair.outline} strokeWidth="1.7" strokeLinecap="round" />
    </g>
  );
}

function IdolWavesHairRear({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hair:idol_waves:rear" data-hair-tone={config.hair_color || palette.hair.base}>
      <HairFinish
        palette={palette}
        paints={paints}
        baseD="M77 49 C61 66 62 86 72 101 C58 114 61 133 74 143 C62 154 68 169 82 171 C96 171 102 158 94 147 C108 132 105 112 94 99 C105 81 99 61 87 50 Z M154 49 C143 65 139 84 149 99 C138 113 136 133 148 147 C139 159 145 171 159 171 C174 168 180 153 167 143 C180 128 177 111 165 99 C176 82 169 62 161 51 Z"
        shadowD="M77 73 C70 88 76 99 84 106 C72 120 76 136 87 145 C80 155 83 164 89 166 C98 158 96 150 91 144 C101 130 97 114 87 103 C97 88 91 75 84 68 Z M159 69 C166 83 162 94 154 102 C165 114 165 130 154 144 C163 152 162 162 155 166 C147 157 149 150 154 143 C144 130 145 115 154 103 C145 88 151 75 159 69 Z"
        highlightD="M76 57 C68 71 71 84 79 94 M71 111 C64 124 69 137 80 143 M158 57 C166 71 163 85 155 94"
        strandD="M84 57 C74 75 79 91 89 100 C77 115 80 132 91 144 M155 58 C166 75 162 90 152 100 C164 115 161 132 150 144"
        detailD="M72 98 C81 103 87 109 88 116 M167 98 C158 103 153 109 152 116 M80 146 C88 150 92 157 89 165 M160 146 C152 150 148 157 154 165"
      />
      <path className="avatar-idol-ribbon avatar-highlight" d="M69 115 C75 123 80 132 79 141 M171 114 C165 123 160 132 161 141" fill="none" stroke="#ff6fcf" strokeWidth="2.1" strokeLinecap="round" opacity="0.86" />
      <path className="avatar-idol-ribbon avatar-highlight" d="M78 103 C84 113 88 124 86 134 M162 103 C156 113 152 124 154 134" fill="none" stroke="#65e6ff" strokeWidth="1.6" strokeLinecap="round" opacity="0.82" />
    </g>
  );
}

function IdolWavesHairFront({ config, palette, paints }) {
  return (
    <g data-avatar-variant="hair:idol_waves:front" data-hair-tone={config.hair_color || palette.hair.base}>
      <HairFinish
        palette={palette}
        paints={paints}
        baseD="M74 80 C70 55 86 33 109 26 C132 19 155 29 165 49 C170 59 167 71 160 81 C154 68 145 59 133 53 C126 50 121 54 116 61 C109 70 102 75 93 77 C86 80 83 87 81 94 C77 91 74 86 74 80 Z"
        shadowD="M122 30 C143 29 159 42 164 59 C153 53 142 50 133 53 C124 54 120 62 114 69 C107 76 98 78 88 82 C91 58 103 39 122 30 Z"
        highlightD="M86 48 C96 39 107 34 118 32 M129 32 C141 34 152 41 158 50 M97 67 C105 64 111 59 116 53"
        strandD="M82 58 C94 53 104 53 112 56 M121 42 C132 38 143 42 151 49 M129 55 C142 57 151 65 157 74"
        detailD="M88 82 C100 79 109 72 115 65 C121 57 125 52 133 53 M81 68 C86 79 84 88 81 94"
      />
      <path className="avatar-idol-fringe avatar-highlight" d="M93 72 C101 69 109 63 115 56" fill="none" stroke="#ff6fcf" strokeWidth="1.65" strokeLinecap="round" opacity="0.82" />
      <path className="avatar-idol-fringe avatar-highlight" d="M136 56 C145 59 152 65 157 72" fill="none" stroke="#65e6ff" strokeWidth="1.45" strokeLinecap="round" opacity="0.82" />
      <path className="avatar-idol-star avatar-detail" d="M145 42 L147 46 L151 47 L148 50 L149 54 L145 52 L142 54 L143 50 L140 47 L144 46 Z" fill="#ffe36b" stroke={palette.hair.outline} strokeWidth="0.9" strokeLinejoin="round" />
    </g>
  );
}

const NONE_HAIR = Object.freeze({ Rear: EmptyHairPart, Front: EmptyHairPart, marginTop: 0 });
const SHORT_HAIR = Object.freeze({ Rear: EmptyHairPart, Front: ShortHairFront, marginTop: 0 });
const LONG_HAIR = Object.freeze({ Rear: LongHairRear, Front: LongHairFront, marginTop: 0 });
const SPIKY_HAIR = Object.freeze({ Rear: EmptyHairPart, Front: SpikyHairFront, marginTop: -1.5 });
const CURLY_HAIR = Object.freeze({ Rear: EmptyHairPart, Front: CurlyHairFront, marginTop: 0 });
const MOHAWK_HAIR = Object.freeze({ Rear: EmptyHairPart, Front: MohawkHairFront, marginTop: 0 });
const BUZZ_HAIR = Object.freeze({ Rear: EmptyHairPart, Front: BuzzHairFront, marginTop: 0 });
const PONYTAIL_HAIR = Object.freeze({ Rear: PonytailHairRear, Front: PonytailHairFront, marginTop: 0 });
const BUN_HAIR = Object.freeze({ Rear: BunHairRear, Front: BunHairFront, marginTop: -7.19 });
const PIGTAILS_HAIR = Object.freeze({ Rear: PigtailsHairRear, Front: PigtailsHairFront, marginTop: 0 });
const AFRO_HAIR = Object.freeze({ Rear: AfroHairRear, Front: AfroHairFront, marginTop: -4.26 });
const BRAIDS_HAIR = Object.freeze({ Rear: BraidsHairRear, Front: BraidsHairFront, marginTop: 0 });
const WAVY_HAIR = Object.freeze({ Rear: WavyHairRear, Front: WavyHairFront, marginTop: 0 });
const SIDE_PART_HAIR = Object.freeze({ Rear: EmptyHairPart, Front: SidePartHairFront, marginTop: 0 });
const FADE_HAIR = Object.freeze({ Rear: EmptyHairPart, Front: FadeHairFront, marginTop: 0 });
const DREADLOCKS_HAIR = Object.freeze({ Rear: DreadlocksHairRear, Front: DreadlocksHairFront, marginTop: 0 });
const BOB_HAIR = Object.freeze({ Rear: BobHairRear, Front: BobHairFront, marginTop: 0 });
const SHOULDER_HAIR = Object.freeze({ Rear: ShoulderHairRear, Front: ShoulderHairFront, marginTop: 0 });
const UNDERCUT_HAIR = Object.freeze({ Rear: EmptyHairPart, Front: UndercutHairFront, marginTop: 0 });
const TWIN_BUNS_HAIR = Object.freeze({ Rear: TwinBunsHairRear, Front: TwinBunsHairFront, marginTop: -0.06 });
const IDOL_WAVES_HAIR = Object.freeze({ Rear: IdolWavesHairRear, Front: IdolWavesHairFront, marginTop: 0 });

export const HAIR_RENDERERS = Object.freeze({
  none: NONE_HAIR,
  short: SHORT_HAIR,
  long: LONG_HAIR,
  spiky: SPIKY_HAIR,
  curly: CURLY_HAIR,
  mohawk: MOHAWK_HAIR,
  buzz: BUZZ_HAIR,
  ponytail: PONYTAIL_HAIR,
  bun: BUN_HAIR,
  pigtails: PIGTAILS_HAIR,
  afro: AFRO_HAIR,
  braids: BRAIDS_HAIR,
  wavy: WAVY_HAIR,
  side_part: SIDE_PART_HAIR,
  fade: FADE_HAIR,
  dreadlocks: DREADLOCKS_HAIR,
  bob: BOB_HAIR,
  shoulder: SHOULDER_HAIR,
  undercut: UNDERCUT_HAIR,
  twin_buns: TWIN_BUNS_HAIR,
  idol_waves: IDOL_WAVES_HAIR,
});
