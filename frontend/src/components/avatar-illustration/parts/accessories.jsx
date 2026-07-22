export function Scarf({ config, palette, paints }) {
  return (
    <g
      data-avatar-variant="accessory:scarf"
      data-avatar-material="fabric"
      data-avatar-bounds="78 110 169 193"
      data-avatar-color={config.accessory_color}
    >
      <path
        className="avatar-accessory-base avatar-outline"
        d="M91 119 C101 111 113 109 123 111 C138 110 153 116 161 127 C156 139 148 146 137 151 C128 143 117 139 106 142 C96 139 88 132 84 125 Z M101 140 C101 155 96 173 89 188 L107 192 C115 176 117 159 114 143 Z"
        fill={paints.gear}
        stroke={palette.gear.outline}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        className="avatar-accessory-shadow"
        d="M126 113 C141 113 153 119 159 127 C153 137 145 143 136 147 C136 134 132 123 126 113 Z M101 145 C105 153 105 173 99 190 L108 192 C115 175 117 159 114 143 Z"
        fill={palette.gear.deep}
        opacity="0.28"
      />
      <path
        className="avatar-accessory-highlight avatar-highlight"
        d="M92 120 C103 114 115 113 126 115 M98 146 C100 157 97 171 93 180"
        fill="none"
        stroke={palette.gear.highlight}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.72"
      />
      <path
        className="avatar-accessory-detail avatar-detail"
        d="M91 184 L89 191 M97 186 L96 192 M103 187 L103 192 M90 129 C108 136 139 133 154 125"
        fill="none"
        stroke={palette.gear.outline}
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.72"
      />
    </g>
  );
}

export function Necklace({ config, palette, paints }) {
  return (
    <g
      data-avatar-variant="accessory:necklace"
      data-avatar-material="gem"
      data-avatar-bounds="91 137 151 190"
      data-avatar-color={config.accessory_color}
    >
      <path
        className="avatar-accessory-base avatar-outline"
        d="M94 141 C99 160 109 172 121 177 C133 172 144 160 148 141"
        fill="none"
        stroke={palette.gear.outline}
        strokeWidth="5.4"
        strokeLinecap="round"
      />
      <path
        className="avatar-accessory-chain"
        d="M95 141 C100 159 109 169 121 174 C133 169 143 159 147 141"
        fill="none"
        stroke={palette.gear.light}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray="3 2"
      />
      <path
        className="avatar-accessory-base avatar-outline"
        d="M121 170 L130 180 L121 188 L112 180 Z"
        fill={paints.gear}
        stroke={palette.gear.outline}
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path
        className="avatar-accessory-highlight avatar-highlight"
        d="M119 176 L122 174 L126 180"
        fill="none"
        stroke={palette.gear.highlight}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="avatar-accessory-detail avatar-detail"
        d="M121 170 L121 188 M112 180 H130"
        fill="none"
        stroke={palette.gear.outline}
        strokeWidth="1"
        opacity="0.62"
      />
    </g>
  );
}

export function BowTie({ config, palette, paints }) {
  return (
    <g
      data-avatar-variant="accessory:bow_tie"
      data-avatar-material="fabric"
      data-avatar-bounds="89 116 153 158"
      data-avatar-color={config.accessory_color}
    >
      <path
        className="avatar-accessory-base avatar-outline"
        d="M119 129 C107 119 96 119 91 124 L94 148 C101 153 111 148 120 140 C130 148 141 153 149 147 L151 123 C143 118 131 120 121 129 Z"
        fill={paints.gear}
        stroke={palette.gear.outline}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        className="avatar-accessory-shadow"
        d="M121 134 C132 128 141 125 149 126 L147 145 C139 148 130 143 121 138 Z"
        fill={palette.gear.deep}
        opacity="0.3"
      />
      <path
        className="avatar-accessory-base avatar-outline"
        d="M113 128 Q121 123 128 129 L127 143 Q120 148 113 142 Z"
        fill={paints.gear}
        stroke={palette.gear.outline}
        strokeWidth="2.4"
      />
      <path
        className="avatar-accessory-highlight avatar-highlight"
        d="M96 126 C103 124 109 128 114 132 M117 129 C120 127 123 127 125 130"
        fill="none"
        stroke={palette.gear.highlight}
        strokeWidth="2.1"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        className="avatar-accessory-detail avatar-detail"
        d="M99 143 L113 135 M143 142 L128 135 M118 131 L123 142"
        fill="none"
        stroke={palette.gear.outline}
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.68"
      />
    </g>
  );
}

export function Cape({ config, palette, paints }) {
  return (
    <g
      data-avatar-variant="accessory:cape"
      data-avatar-material="fabric"
      data-avatar-bounds="54 124 188 281"
      data-avatar-color={config.accessory_color}
    >
      <path
        className="avatar-accessory-base avatar-outline"
        d="M86 131 C76 143 70 165 67 190 C63 220 58 249 57 267 C76 278 98 281 120 275 C142 283 166 279 184 267 C180 235 177 199 173 171 C170 151 163 136 154 129 C137 137 105 138 86 131 Z"
        fill={paints.gear}
        stroke={palette.gear.outline}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        className="avatar-accessory-shadow"
        d="M125 137 C145 138 159 135 166 145 C173 180 176 229 181 265 C164 275 146 278 126 273 C137 230 137 181 125 137 Z"
        fill={palette.gear.deep}
        opacity="0.32"
      />
      <path
        className="avatar-accessory-highlight avatar-highlight"
        d="M85 139 C77 168 74 213 68 253 C79 261 91 265 102 264"
        fill="none"
        stroke={palette.gear.highlight}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.64"
      />
      <path
        className="avatar-accessory-detail avatar-detail"
        d="M96 139 C91 180 93 230 100 270 M143 138 C152 182 151 230 143 273 M69 253 C84 268 102 271 120 267 C139 273 160 267 179 253"
        fill="none"
        stroke={palette.gear.outline}
        strokeWidth="1.7"
        strokeLinecap="round"
        opacity="0.58"
      />
    </g>
  );
}

export function Wings({ config, palette, paints }) {
  return (
    <g
      data-avatar-variant="accessory:wings"
      data-avatar-material="feather"
      data-avatar-bounds="14 112 226 249"
      data-avatar-color={config.accessory_color}
    >
      <path
        className="avatar-accessory-base avatar-outline"
        d="M91 142 C74 121 55 113 40 117 C47 128 47 137 36 143 C29 147 23 147 17 146 C25 160 35 168 50 168 C39 180 30 194 24 211 C39 213 52 208 64 197 C57 215 57 230 60 244 C77 235 91 215 102 187 Z M149 142 C166 121 185 113 201 117 C193 128 194 137 205 143 C212 147 218 147 223 146 C215 160 205 168 190 168 C202 180 211 194 217 211 C201 213 188 208 176 197 C183 215 183 230 180 244 C163 235 149 215 138 187 Z"
        fill={paints.gear}
        stroke={palette.gear.outline}
        strokeWidth="3.3"
        strokeLinejoin="round"
      />
      <path
        className="avatar-accessory-shadow"
        d="M91 146 C70 132 54 126 43 126 C52 143 54 158 48 169 C65 164 79 165 94 175 Z M149 146 C171 132 187 126 198 126 C188 143 186 158 192 169 C175 164 161 165 146 175 Z"
        fill={palette.gear.deep}
        opacity="0.24"
      />
      <path
        className="avatar-accessory-highlight avatar-highlight"
        d="M85 143 C66 127 53 123 43 124 M79 161 C57 154 41 157 31 164 M158 143 C176 128 189 123 198 124 M163 161 C184 154 200 157 211 164"
        fill="none"
        stroke={palette.gear.highlight}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.72"
      />
      <path
        className="avatar-accessory-detail avatar-detail"
        d="M91 151 C70 164 57 184 50 207 M95 170 C76 188 68 211 65 232 M149 151 C170 164 183 184 190 207 M145 170 C164 188 172 211 175 232"
        fill="none"
        stroke={palette.gear.outline}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.6"
      />
    </g>
  );
}

export function Shield({ config, palette, paints }) {
  return (
    <g
      data-avatar-variant="accessory:shield"
      data-avatar-material="metal"
      data-avatar-bounds="45 160 113 266"
      data-avatar-color={config.accessory_color}
    >
      <path
        className="avatar-accessory-base avatar-outline"
        d="M50 173 C67 162 91 161 108 172 L106 216 C102 238 90 254 78 262 C63 251 52 237 49 217 Z"
        fill={paints.gear}
        stroke={palette.gear.outline}
        strokeWidth="3.6"
        strokeLinejoin="round"
      />
      <path
        className="avatar-accessory-shadow"
        d="M79 165 C91 165 101 168 108 173 L106 216 C102 238 91 253 79 261 Z"
        fill={palette.gear.deep}
        opacity="0.3"
      />
      <path
        className="avatar-accessory-highlight avatar-highlight"
        d="M57 177 C68 170 79 168 90 170 M57 183 L57 213 C59 229 67 242 77 251"
        fill="none"
        stroke={palette.gear.highlight}
        strokeWidth="2.8"
        strokeLinecap="round"
        opacity="0.78"
      />
      <path
        className="avatar-accessory-detail avatar-detail"
        d="M78 183 L84 196 L98 198 L88 208 L91 223 L78 216 L65 223 L68 208 L58 198 L72 196 Z"
        fill={palette.gear.light}
        stroke={palette.gear.outline}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="78" cy="204" r="6" fill={palette.gear.deep} opacity="0.55" />
      <circle cx="76" cy="201" r="2" fill={palette.gear.highlight} opacity="0.8" />
    </g>
  );
}

export function Sword({ config, palette, paints }) {
  return (
    <g
      data-avatar-variant="accessory:sword"
      data-avatar-material="metal"
      data-avatar-bounds="151 112 224 287"
      data-avatar-color={config.accessory_color}
    >
      <path
        className="avatar-accessory-base avatar-outline"
        d="M183 142 L193 140 L220 270 L212 283 L202 272 Z"
        fill={paints.gear}
        stroke={palette.gear.outline}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        className="avatar-accessory-shadow"
        d="M189 143 L193 142 L218 269 L212 279 Z"
        fill={palette.gear.deep}
        opacity="0.28"
      />
      <path
        className="avatar-accessory-highlight avatar-highlight"
        d="M185 149 L211 268"
        fill="none"
        stroke={palette.gear.highlight}
        strokeWidth="2.3"
        strokeLinecap="round"
        opacity="0.78"
      />
      <path
        className="avatar-accessory-base avatar-outline"
        d="M166 132 L193 127 L196 138 L169 144 Z"
        fill={paints.gear}
        stroke={palette.gear.outline}
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path
        className="avatar-accessory-detail avatar-detail"
        d="M177 133 L173 118 L181 116 L186 130 M175 121 L183 119 M176 125 L184 123"
        fill="none"
        stroke={palette.gear.outline}
        strokeWidth="3.8"
        strokeLinecap="round"
      />
      <circle cx="175" cy="116" r="5" fill={palette.gear.light} stroke={palette.gear.outline} strokeWidth="2" />
    </g>
  );
}

export function StageMic({ config, palette, paints }) {
  return (
    <g
      data-avatar-variant="accessory:stage_mic"
      data-avatar-material="mesh"
      data-avatar-bounds="158 147 202 236"
      data-avatar-color={config.accessory_color}
    >
      <path
        className="avatar-accessory-base avatar-outline"
        d="M179 175 L191 180 L174 231 L162 226 Z"
        fill={paints.gear}
        stroke={palette.gear.outline}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        className="avatar-accessory-highlight avatar-highlight"
        d="M184 181 L169 222"
        fill="none"
        stroke={palette.gear.highlight}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.78"
      />
      <path
        className="avatar-accessory-base avatar-outline"
        d="M180 151 C188 148 196 153 198 160 C201 169 195 180 187 182 C178 181 172 172 173 164 C173 158 175 154 180 151 Z"
        fill={paints.gear}
        stroke={palette.gear.outline}
        strokeWidth="3"
      />
      <path
        className="avatar-accessory-detail avatar-detail"
        d="M176 158 L196 166 M175 164 L193 174 M181 152 L177 176 M188 151 L184 180 M194 155 L190 179"
        fill="none"
        stroke={palette.gear.light}
        strokeWidth="1.35"
        strokeLinecap="round"
        opacity="0.9"
      />
      <circle cx="168" cy="228" r="4.2" fill={palette.gear.deep} stroke={palette.gear.outline} strokeWidth="1.6" />
    </g>
  );
}

export function SpiritBlade({ config, palette, paints }) {
  return (
    <g
      data-avatar-variant="accessory:spirit_blade"
      data-avatar-material="gem"
      data-avatar-bounds="15 103 92 291"
      data-avatar-color={config.accessory_color}
    >
      <path
        className="avatar-accessory-base avatar-outline"
        d="M72 132 L83 139 L40 274 L20 287 L25 265 Z"
        fill={paints.gear}
        stroke={palette.gear.outline}
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path
        className="avatar-accessory-shadow"
        d="M77 139 L82 141 L39 273 L24 283 Z"
        fill={palette.gear.deep}
        opacity="0.3"
      />
      <path
        className="avatar-accessory-highlight avatar-highlight"
        d="M71 142 L31 267"
        fill="none"
        stroke={palette.gear.highlight}
        strokeWidth="2.8"
        strokeLinecap="round"
        opacity="0.88"
      />
      <path
        className="avatar-accessory-base avatar-outline"
        d="M61 126 L87 139 L82 150 L56 137 Z"
        fill={paints.gear}
        stroke={palette.gear.outline}
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path
        className="avatar-accessory-detail avatar-detail"
        d="M68 129 L76 111 L84 116 L79 134 M66 170 L70 180 L60 184 L65 194 M52 214 L57 223 L47 228 L52 237"
        fill="none"
        stroke={palette.gear.light}
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M75 106 L84 116 L77 125 L68 115 Z" fill={palette.gear.highlight} stroke={palette.gear.outline} strokeWidth="2" />
    </g>
  );
}

export function BellCollar({ config, palette, paints }) {
  return (
    <g
      data-avatar-variant="accessory:bell_collar"
      data-avatar-material="leather"
      data-avatar-bounds="84 110 158 169"
      data-avatar-color={config.accessory_color}
    >
      <path
        className="avatar-accessory-base avatar-outline"
        d="M88 118 C106 129 136 129 153 117 L156 130 C138 143 105 143 86 130 Z"
        fill={paints.gear}
        stroke={palette.gear.outline}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        className="avatar-accessory-highlight avatar-highlight"
        d="M92 120 C109 129 135 129 150 120"
        fill="none"
        stroke={palette.gear.highlight}
        strokeWidth="2.3"
        strokeLinecap="round"
        opacity="0.76"
      />
      <path
        className="avatar-accessory-base avatar-outline"
        d="M113 139 C113 130 129 130 130 139 L137 151 C140 160 132 167 122 167 C111 167 103 160 107 151 Z"
        fill={paints.gear}
        stroke={palette.gear.outline}
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <path
        className="avatar-accessory-detail avatar-detail"
        d="M108 153 H136 M116 158 C120 155 125 155 130 158"
        fill="none"
        stroke={palette.gear.outline}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.8"
      />
      <circle cx="122" cy="162" r="2.8" fill={palette.gear.deep} />
      <circle cx="116" cy="143" r="2" fill={palette.gear.light} opacity="0.72" />
    </g>
  );
}

export const ACCESSORY_RENDERERS = Object.freeze({
  scarf: Object.freeze({ layer: 'front', Component: Scarf }),
  necklace: Object.freeze({ layer: 'front', Component: Necklace }),
  bow_tie: Object.freeze({ layer: 'front', Component: BowTie }),
  cape: Object.freeze({ layer: 'rear', Component: Cape }),
  wings: Object.freeze({ layer: 'rear', Component: Wings }),
  shield: Object.freeze({ layer: 'front', Component: Shield }),
  sword: Object.freeze({ layer: 'rear', Component: Sword }),
  stage_mic: Object.freeze({ layer: 'front', Component: StageMic }),
  spirit_blade: Object.freeze({ layer: 'rear', Component: SpiritBlade }),
  bell_collar: Object.freeze({ layer: 'front', Component: BellCollar }),
});
