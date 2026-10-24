const EYE_WHITE = '#fffaf4';
const TOOTH_WHITE = '#fffdf8';
const TEAR_BLUE = '#72d7ff';

function OpenEye({
  config,
  palette,
  x,
  y = 82,
  rx = 9.5,
  ry = 14,
  irisRx = 5.3,
  irisRy = 8.2,
  lookX = 0,
  tilt = 0,
}) {
  const eyeColor = config.eye_color || palette.hair.deep;
  const pupilX = x + lookX + 0.7;

  return (
    <g className="avatar-eye-surface" transform={`rotate(${tilt} ${x} ${y})`}>
      <ellipse
        className="avatar-eye-sclera avatar-outline"
        cx={x}
        cy={y}
        rx={rx}
        ry={ry}
        fill={EYE_WHITE}
        stroke={palette.skin.outline}
        strokeWidth="1.7"
      />
      <ellipse
        className="avatar-eye-iris"
        cx={x + lookX}
        cy={y + 1}
        rx={irisRx}
        ry={irisRy}
        fill={eyeColor}
      />
      <ellipse
        className="avatar-eye-pupil avatar-detail"
        cx={pupilX}
        cy={y + 2}
        rx={Math.max(2.5, irisRx * 0.58)}
        ry={Math.max(4, irisRy * 0.64)}
        fill={palette.hair.deep}
      />
      <circle
        className="avatar-eye-highlight-small avatar-highlight"
        cx={pupilX - 2.2}
        cy={y - 3.2}
        r="1.35"
        fill="#ffffff"
      />
      <circle
        className="avatar-eye-highlight-small avatar-highlight"
        cx={pupilX + 1.8}
        cy={y + 5}
        r="0.68"
        fill="#ffffff"
        opacity="0.86"
      />
      <path
        className="avatar-upper-lid avatar-detail"
        d={`M${x - rx + 1} ${y - 2} C${x - 4} ${y - ry + 1} ${x + 5} ${y - ry + 1} ${x + rx - 1} ${y - 2}`}
        fill="none"
        stroke={palette.skin.outline}
        strokeWidth="1.45"
        strokeLinecap="round"
        opacity="0.78"
      />
    </g>
  );
}

function OpenEyePair({
  config,
  palette,
  leftX = 104.5,
  rightX = 137.5,
  y = 82,
  rx = 9.5,
  ry = 14,
  irisRx = 5.3,
  irisRy = 8.2,
  lookX = 0,
  leftTilt = 0,
  rightTilt = 0,
}) {
  return (
    <g className="avatar-eyelids" data-avatar-eye-surfaces="eligible">
      <OpenEye
        config={config}
        palette={palette}
        x={leftX}
        y={y}
        rx={rx}
        ry={ry}
        irisRx={irisRx}
        irisRy={irisRy}
        lookX={lookX}
        tilt={leftTilt}
      />
      <OpenEye
        config={config}
        palette={palette}
        x={rightX}
        y={y}
        rx={rx}
        ry={ry}
        irisRx={irisRx}
        irisRy={irisRy}
        lookX={lookX}
        tilt={rightTilt}
      />
    </g>
  );
}

function ExpressionBrows({
  palette,
  left = 'M93 66 C98 61 106 61 111 65',
  right = 'M130 65 C136 60 143 61 148 66',
  strokeWidth = 3.3,
}) {
  return (
    <g className="avatar-expression-brows">
      <path
        className="avatar-brow avatar-brow-left avatar-detail"
        d={left}
        fill="none"
        stroke={palette.hair.deep}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        className="avatar-brow avatar-brow-right avatar-detail"
        d={right}
        fill="none"
        stroke={palette.hair.deep}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </g>
  );
}

export function FaceModeling({ config, palette }) {
  return (
    <g data-avatar-face-modeling="true" data-face-tone={config.head_color || palette.skin.base}>
      <path
        className="avatar-upper-eye-plane avatar-face-plane"
        d="M94 77 C99 68 108 65 115 70 C110 68 104 68 100 71 C97 73 95 75 94 77 Z M127 77 C132 68 141 65 149 70 C144 68 138 68 134 71 C131 73 129 75 127 77 Z"
        fill={palette.skin.shadow}
        opacity="0.13"
      />
      <path
        className="avatar-nose-plane avatar-face-plane avatar-detail"
        d="M121 87 C118 92 118 97 121 100 C123 102 127 101 130 97 C127 99 124 98 123 96 C122 93 124 90 121 87 Z"
        fill={palette.skin.shadow}
        opacity="0.34"
      />
      <path
        className="avatar-highlight"
        d="M121 90 C122 89 124 89 125 90"
        fill="none"
        stroke={palette.skin.highlight}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <ellipse className="avatar-cheek" cx="92" cy="102" rx="7.8" ry="3.6" fill={palette.skin.cheek} opacity="0.4" />
      <ellipse className="avatar-cheek" cx="148" cy="102" rx="7.8" ry="3.6" fill={palette.skin.cheek} opacity="0.4" />
      <circle className="avatar-highlight" cx="89.5" cy="100.8" r="1.05" fill={palette.skin.highlight} opacity="0.68" />
      <circle className="avatar-highlight" cx="145.5" cy="100.8" r="1.05" fill={palette.skin.highlight} opacity="0.68" />
    </g>
  );
}

export function NormalEyes({ config, palette }) {
  return (
    <g data-avatar-variant="eyes:normal" className="avatar-eyes-normal">
      <OpenEyePair config={config} palette={palette} />
      <ExpressionBrows palette={palette} />
    </g>
  );
}

export function HappyEyes({ config, palette }) {
  return (
    <g data-avatar-variant="eyes:happy" className="avatar-eyes-happy">
      <g className="avatar-eyelids avatar-eye-happy-arc" data-avatar-eye-surfaces="replacement">
        <path d="M94 84 C99 74 109 74 115 84" fill="none" stroke={config.eye_color || palette.hair.deep} strokeWidth="4" strokeLinecap="round" />
        <path d="M127 84 C133 74 143 74 149 84" fill="none" stroke={config.eye_color || palette.hair.deep} strokeWidth="4" strokeLinecap="round" />
        <path className="avatar-detail" d="M94 83 L90 80 M149 83 L153 80" fill="none" stroke={palette.hair.deep} strokeWidth="1.6" strokeLinecap="round" />
      </g>
      <ExpressionBrows
        palette={palette}
        left="M93 66 C99 59 107 59 112 64"
        right="M129 64 C136 58 144 59 149 66"
      />
    </g>
  );
}

export function WideEyes({ config, palette }) {
  return (
    <g data-avatar-variant="eyes:wide" className="avatar-eyes-wide">
      <OpenEyePair config={config} palette={palette} y={81} rx={10.8} ry={15.8} irisRx={5.9} irisRy={9.2} />
      <ExpressionBrows
        palette={palette}
        left="M91 64 C98 56 108 56 114 62"
        right="M127 62 C135 55 145 56 151 64"
        strokeWidth={3.1}
      />
    </g>
  );
}

export function SleepyEyes({ config, palette }) {
  return (
    <g data-avatar-variant="eyes:sleepy" className="avatar-eyes-sleepy">
      <OpenEyePair config={config} palette={palette} y={84} rx={9.2} ry={7.2} irisRx={4.6} irisRy={5.4} lookX={-0.5} />
      <path className="avatar-eye-sleepy avatar-detail" d="M95 80 C101 84 109 84 114 80 M128 80 C134 84 143 84 148 80" fill="none" stroke={palette.skin.outline} strokeWidth="2.2" strokeLinecap="round" />
      <ExpressionBrows
        palette={palette}
        left="M94 67 C100 65 106 65 111 67"
        right="M130 67 C136 65 142 65 147 68"
        strokeWidth={2.8}
      />
    </g>
  );
}

export function WinkEyes({ config, palette }) {
  return (
    <g data-avatar-variant="eyes:wink" className="avatar-eyes-wink">
      <g className="avatar-eyelids" data-avatar-eye-surfaces="mixed">
        <OpenEye config={config} palette={palette} x={104.5} />
        <path className="avatar-eye-wink avatar-detail" d="M128 84 C134 76 143 77 149 84" fill="none" stroke={config.eye_color || palette.hair.deep} strokeWidth="3.8" strokeLinecap="round" />
        <path className="avatar-detail" d="M148 82 L152 79" fill="none" stroke={palette.hair.deep} strokeWidth="1.5" strokeLinecap="round" />
      </g>
      <ExpressionBrows
        palette={palette}
        left="M93 65 C99 60 106 60 111 65"
        right="M129 66 C136 62 143 62 149 66"
      />
    </g>
  );
}

export function AngryEyes({ config, palette }) {
  return (
    <g data-avatar-variant="eyes:angry" className="avatar-eyes-angry">
      <OpenEyePair config={config} palette={palette} y={84} rx={9.4} ry={11.5} irisRx={5} irisRy={7.2} leftTilt={4} rightTilt={-4} />
      <ExpressionBrows
        palette={palette}
        left="M92 62 L112 69"
        right="M129 69 L150 62"
        strokeWidth={4}
      />
      <path className="avatar-detail" d="M96 96 C101 99 108 99 113 96 M130 96 C136 99 143 99 147 96" fill="none" stroke={palette.skin.cheek} strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
    </g>
  );
}

export function DotEyes({ config, palette }) {
  const eyeColor = config.eye_color || palette.hair.deep;
  return (
    <g data-avatar-variant="eyes:dot" className="avatar-eyes-dot">
      <g className="avatar-eyelids avatar-eye-dot" data-avatar-eye-surfaces="replacement">
        <circle cx="104" cy="84" r="5.1" fill={eyeColor} />
        <circle cx="138" cy="84" r="5.1" fill={eyeColor} />
        <circle className="avatar-highlight" cx="102.5" cy="82.5" r="1" fill="#ffffff" opacity="0.86" />
        <circle className="avatar-highlight" cx="136.5" cy="82.5" r="1" fill="#ffffff" opacity="0.86" />
      </g>
      <ExpressionBrows
        palette={palette}
        left="M96 69 C101 66 106 66 110 69"
        right="M132 69 C137 66 142 66 146 69"
        strokeWidth={2.4}
      />
    </g>
  );
}

export function StarEyes({ config, palette }) {
  const eyeColor = config.eye_color || palette.hair.deep;
  return (
    <g data-avatar-variant="eyes:star" className="avatar-eyes-star">
      <g className="avatar-eyelids avatar-eye-star" data-avatar-eye-surfaces="replacement">
        <circle cx="104" cy="83" r="11" fill={palette.skin.highlight} opacity="0.14" />
        <circle cx="138" cy="83" r="11" fill={palette.skin.highlight} opacity="0.14" />
        <path d="M104 72 L107 79 L114 79 L108.5 84 L111 92 L104 87 L97 92 L99.5 84 L94 79 L101 79 Z" fill={eyeColor} stroke={palette.hair.deep} strokeWidth="1" strokeLinejoin="round" />
        <path d="M138 72 L141 79 L148 79 L142.5 84 L145 92 L138 87 L131 92 L133.5 84 L128 79 L135 79 Z" fill={eyeColor} stroke={palette.hair.deep} strokeWidth="1" strokeLinejoin="round" />
        <circle className="avatar-highlight" cx="101" cy="78" r="1.1" fill="#ffffff" />
        <circle className="avatar-highlight" cx="135" cy="78" r="1.1" fill="#ffffff" />
      </g>
      <ExpressionBrows
        palette={palette}
        left="M92 64 C99 57 108 57 114 63"
        right="M127 63 C135 56 145 57 151 64"
      />
    </g>
  );
}

export function GlassesEyes({ config, palette }) {
  return (
    <g data-avatar-variant="eyes:glasses" className="avatar-eyes-glasses">
      <OpenEyePair config={config} palette={palette} y={83} rx={8.7} ry={12.4} irisRx={4.8} irisRy={7.2} />
      <ExpressionBrows palette={palette} />
      <g className="avatar-eyewear avatar-glasses" data-avatar-eye-overlay="glasses">
        <rect x="91" y="68" width="27" height="28" rx="10" fill={palette.background.highlight} fillOpacity="0.1" stroke={palette.hair.deep} strokeWidth="3" />
        <rect x="124" y="68" width="27" height="28" rx="10" fill={palette.background.highlight} fillOpacity="0.1" stroke={palette.hair.deep} strokeWidth="3" />
        <path d="M118 79 C120 77 122 77 124 79 M91 75 L82 71 M151 75 L159 71" fill="none" stroke={palette.hair.deep} strokeWidth="2.5" strokeLinecap="round" />
        <path className="avatar-highlight" d="M96 74 L103 70 M129 74 L136 70" fill="none" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
      </g>
    </g>
  );
}

export function SunglassesEyes({ config, palette }) {
  const lens = config.eye_color || palette.hair.deep;
  return (
    <g data-avatar-variant="eyes:sunglasses" className="avatar-eyes-sunglasses">
      <ExpressionBrows
        palette={palette}
        left="M92 65 C99 61 107 61 113 65"
        right="M128 65 C135 61 144 61 150 65"
        strokeWidth={2.8}
      />
      <g className="avatar-eyewear avatar-sunglasses" data-avatar-eye-surfaces="replacement">
        <path d="M89 73 C96 69 108 69 118 73 L115 91 C108 97 96 96 92 89 Z" fill={lens} stroke={palette.hair.outline} strokeWidth="3" strokeLinejoin="round" />
        <path d="M123 73 C133 69 145 69 152 73 L149 89 C145 96 133 97 126 91 Z" fill={lens} stroke={palette.hair.outline} strokeWidth="3" strokeLinejoin="round" />
        <path d="M118 77 C120 75 122 75 124 77 M90 76 L81 72 M151 76 L160 72" fill="none" stroke={palette.hair.outline} strokeWidth="2.8" strokeLinecap="round" />
        <path className="avatar-highlight" d="M96 76 L106 73 M130 76 L140 73" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
      </g>
    </g>
  );
}

export function EyePatchEyes({ config, palette }) {
  return (
    <g data-avatar-variant="eyes:eye_patch" className="avatar-eyes-eye-patch">
      <g className="avatar-eyelids" data-avatar-eye-surfaces="mixed">
        <OpenEye config={config} palette={palette} x={104.5} y={82} />
      </g>
      <ExpressionBrows
        palette={palette}
        left="M93 65 C99 60 106 60 112 65"
        right="M130 65 C136 62 143 62 149 66"
      />
      <g className="avatar-eye-patch" data-avatar-eye-overlay="patch">
        <path d="M86 61 C108 66 132 68 157 64" fill="none" stroke={palette.hair.deep} strokeWidth="3.2" strokeLinecap="round" />
        <path d="M126 72 C134 67 145 68 151 74 L149 91 C142 98 130 96 126 88 Z" fill={palette.hair.deep} stroke={palette.hair.outline} strokeWidth="2.4" strokeLinejoin="round" />
        <path className="avatar-highlight" d="M132 75 C137 72 143 72 146 75" fill="none" stroke={palette.hair.light} strokeWidth="1.5" strokeLinecap="round" opacity="0.48" />
      </g>
    </g>
  );
}

export function CryingEyes({ config, palette }) {
  return (
    <g data-avatar-variant="eyes:crying" className="avatar-eyes-crying">
      <OpenEyePair config={config} palette={palette} y={81} ry={13.2} lookX={-0.7} />
      <ExpressionBrows
        palette={palette}
        left="M92 67 C99 60 106 62 112 68"
        right="M129 68 C135 62 143 60 150 67"
      />
      <g className="avatar-eye-tears" data-avatar-eye-overlay="tears">
        <path d="M96 91 C96 104 99 111 104 116 C109 110 110 101 108 94 Z" fill={TEAR_BLUE} stroke="#318bc4" strokeWidth="1.2" opacity="0.82" />
        <path d="M130 94 C129 104 133 113 138 118 C143 111 144 102 141 93 Z" fill={TEAR_BLUE} stroke="#318bc4" strokeWidth="1.2" opacity="0.82" />
        <path className="avatar-highlight" d="M100 98 L102 108 M134 99 L136 110" fill="none" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round" opacity="0.72" />
      </g>
    </g>
  );
}

export function HeartEyes({ config, palette }) {
  const eyeColor = config.eye_color || '#ed5b87';
  return (
    <g data-avatar-variant="eyes:heart_eyes" className="avatar-eyes-heart">
      <g className="avatar-eyelids avatar-eye-heart" data-avatar-eye-surfaces="replacement">
        <path d="M104 94 C100 88 93 84 93 77 C93 69 103 68 104 75 C106 68 116 69 116 77 C116 84 109 89 104 94 Z" fill={eyeColor} stroke={palette.hair.deep} strokeWidth="1.4" />
        <path d="M138 94 C133 88 126 84 126 77 C126 69 136 68 138 75 C140 68 150 69 150 77 C150 84 143 89 138 94 Z" fill={eyeColor} stroke={palette.hair.deep} strokeWidth="1.4" />
        <circle className="avatar-highlight" cx="101" cy="76" r="1.3" fill="#ffffff" />
        <circle className="avatar-highlight" cx="135" cy="76" r="1.3" fill="#ffffff" />
      </g>
      <ExpressionBrows
        palette={palette}
        left="M91 64 C99 56 109 56 115 63"
        right="M126 63 C134 55 145 56 152 64"
      />
    </g>
  );
}

export function DizzyEyes({ config, palette }) {
  const eyeColor = config.eye_color || palette.hair.deep;
  return (
    <g data-avatar-variant="eyes:dizzy" className="avatar-eyes-dizzy">
      <g className="avatar-eyelids avatar-eye-dizzy" data-avatar-eye-surfaces="replacement">
        <path d="M104 75 C96 69 90 80 96 88 C102 96 116 91 114 80 C112 72 100 70 95 78" fill="none" stroke={eyeColor} strokeWidth="3" strokeLinecap="round" />
        <path d="M138 75 C130 69 124 80 130 88 C136 96 150 91 148 80 C146 72 134 70 129 78" fill="none" stroke={eyeColor} strokeWidth="3" strokeLinecap="round" />
        <circle cx="104" cy="83" r="2" fill={palette.hair.deep} />
        <circle cx="138" cy="83" r="2" fill={palette.hair.deep} />
      </g>
      <ExpressionBrows
        palette={palette}
        left="M92 65 C97 60 103 68 111 63"
        right="M130 63 C137 68 143 60 150 65"
        strokeWidth={2.8}
      />
    </g>
  );
}

export function ClosedEyes({ config, palette }) {
  return (
    <g data-avatar-variant="eyes:closed" className="avatar-eyes-closed">
      <g className="avatar-eyelids avatar-eye-closed" data-avatar-eye-surfaces="replacement">
        <path d="M94 82 C100 91 109 91 115 82" fill="none" stroke={config.eye_color || palette.hair.deep} strokeWidth="3.8" strokeLinecap="round" />
        <path d="M127 82 C133 91 143 91 149 82" fill="none" stroke={config.eye_color || palette.hair.deep} strokeWidth="3.8" strokeLinecap="round" />
        <path className="avatar-detail" d="M94 82 L90 84 M115 82 L118 84 M127 82 L123 84 M149 82 L153 84" fill="none" stroke={palette.hair.deep} strokeWidth="1.4" strokeLinecap="round" />
      </g>
      <ExpressionBrows
        palette={palette}
        left="M94 66 C100 63 106 63 111 66"
        right="M130 66 C136 63 142 63 147 67"
        strokeWidth={2.8}
      />
    </g>
  );
}

export function SmileMouth({ config, palette }) {
  const color = config.mouth_color || palette.skin.outline;
  return (
    <g data-avatar-variant="mouth:smile" className="avatar-mouth-smile">
      <path className="avatar-detail" d="M107 108 C114 117 128 118 136 108" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <path className="avatar-face-plane" d="M114 114 C120 119 128 116 132 112 C127 118 120 121 114 114 Z" fill={palette.skin.cheek} opacity="0.42" />
    </g>
  );
}

export function GrinMouth({ config, palette }) {
  const color = config.mouth_color || palette.skin.outline;
  return (
    <g data-avatar-variant="mouth:grin" className="avatar-mouth-grin">
      <path d="M104 107 C112 105 129 105 138 107 C136 121 128 126 120 126 C111 125 106 119 104 107 Z" fill={color} stroke={palette.skin.outline} strokeWidth="1.8" strokeLinejoin="round" />
      <path className="avatar-highlight" d="M107 108 C115 107 128 107 135 109 C132 115 126 117 120 117 C114 117 109 114 107 108 Z" fill={TOOTH_WHITE} />
      <path className="avatar-detail" d="M110 112 C117 114 128 114 133 111 M120 108 L120 116" fill="none" stroke="#c9bfc0" strokeWidth="0.9" opacity="0.75" />
      <path d="M113 121 C118 118 126 118 131 121 C126 125 118 126 113 121 Z" fill={palette.skin.cheek} opacity="0.8" />
    </g>
  );
}

export function NeutralMouth({ config, palette }) {
  const color = config.mouth_color || palette.skin.outline;
  return (
    <g data-avatar-variant="mouth:neutral" className="avatar-mouth-neutral">
      <path className="avatar-detail" d="M109 112 C117 111 126 111 133 112" fill="none" stroke={color} strokeWidth="2.7" strokeLinecap="round" />
      <path d="M114 115 C120 117 126 116 130 114" fill="none" stroke={palette.skin.cheek} strokeWidth="1.4" strokeLinecap="round" opacity="0.45" />
    </g>
  );
}

export function OpenMouth({ config, palette }) {
  const color = config.mouth_color || palette.skin.deep;
  return (
    <g data-avatar-variant="mouth:open" className="avatar-mouth-open">
      <ellipse cx="121" cy="114" rx="10" ry="12" fill={color} stroke={palette.skin.outline} strokeWidth="1.8" />
      <path className="avatar-highlight" d="M113 108 C118 105 125 105 130 108 L129 112 C124 110 117 110 113 112 Z" fill={TOOTH_WHITE} />
      <path d="M115 120 C119 116 125 116 129 120 C127 124 124 126 121 126 C118 126 116 124 115 120 Z" fill={palette.skin.cheek} opacity="0.86" />
      <circle className="avatar-highlight" cx="117" cy="106" r="1" fill="#ffffff" opacity="0.6" />
    </g>
  );
}

export function TongueMouth({ config, palette }) {
  const color = config.mouth_color || palette.skin.deep;
  return (
    <g data-avatar-variant="mouth:tongue" className="avatar-mouth-tongue">
      <path d="M108 108 C115 104 128 104 135 108 C134 119 129 124 121 124 C113 124 109 118 108 108 Z" fill={color} stroke={palette.skin.outline} strokeWidth="1.7" />
      <path className="avatar-highlight" d="M111 108 C117 106 127 106 132 108 C129 112 115 112 111 108 Z" fill={TOOTH_WHITE} />
      <path d="M113 119 C115 114 128 113 131 119 L130 128 C126 133 117 132 114 127 Z" fill={palette.skin.cheek} stroke={palette.skin.outline} strokeWidth="1.2" />
      <path className="avatar-detail" d="M122 117 L122 128" fill="none" stroke={palette.skin.shadow} strokeWidth="1" strokeLinecap="round" opacity="0.7" />
    </g>
  );
}

export function FrownMouth({ config, palette }) {
  const color = config.mouth_color || palette.skin.outline;
  return (
    <g data-avatar-variant="mouth:frown" className="avatar-mouth-frown">
      <path className="avatar-detail" d="M108 118 C115 107 128 107 135 118" fill="none" stroke={color} strokeWidth="2.7" strokeLinecap="round" />
      <path d="M114 116 C119 112 126 112 131 116" fill="none" stroke={palette.skin.cheek} strokeWidth="1.3" strokeLinecap="round" opacity="0.5" />
      <circle cx="108" cy="118" r="1.2" fill={palette.skin.cheek} opacity="0.5" />
    </g>
  );
}

export function SurprisedMouth({ config, palette }) {
  const color = config.mouth_color || palette.skin.deep;
  return (
    <g data-avatar-variant="mouth:surprised" className="avatar-mouth-surprised">
      <ellipse cx="121" cy="115" rx="7.2" ry="9.2" fill={color} stroke={palette.skin.outline} strokeWidth="1.8" />
      <ellipse cx="121" cy="118" rx="4.3" ry="3" fill={palette.skin.cheek} opacity="0.72" />
      <path className="avatar-highlight" d="M118 109 C120 108 123 108 125 110" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.55" />
    </g>
  );
}

export function SmirkMouth({ config, palette }) {
  const color = config.mouth_color || palette.skin.outline;
  return (
    <g data-avatar-variant="mouth:smirk" className="avatar-mouth-smirk">
      <path className="avatar-detail" d="M108 114 C116 116 127 112 136 106" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M124 113 C130 111 134 108 137 105" fill="none" stroke={palette.skin.cheek} strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
      <circle cx="137" cy="106" r="1.4" fill={palette.skin.cheek} opacity="0.5" />
    </g>
  );
}

export function BracesMouth({ config, palette }) {
  const color = config.mouth_color || palette.skin.outline;
  return (
    <g data-avatar-variant="mouth:braces" className="avatar-mouth-braces">
      <path d="M104 107 C113 104 129 104 138 107 C136 121 129 125 121 125 C112 125 106 119 104 107 Z" fill={color} stroke={palette.skin.outline} strokeWidth="1.7" />
      <path className="avatar-highlight" d="M107 108 C115 106 128 106 135 108 L133 117 C126 120 115 119 109 115 Z" fill={TOOTH_WHITE} />
      <path className="avatar-detail" d="M109 113 C116 114 127 114 134 112" fill="none" stroke="#8b99aa" strokeWidth="1.2" />
      <rect x="110" y="110" width="3.3" height="5" rx="0.7" fill="#c9d3df" stroke="#667386" strokeWidth="0.6" />
      <rect x="116" y="110" width="3.3" height="5.3" rx="0.7" fill="#c9d3df" stroke="#667386" strokeWidth="0.6" />
      <rect x="122" y="110" width="3.3" height="5.3" rx="0.7" fill="#c9d3df" stroke="#667386" strokeWidth="0.6" />
      <rect x="128" y="109.5" width="3.3" height="5" rx="0.7" fill="#c9d3df" stroke="#667386" strokeWidth="0.6" />
    </g>
  );
}

export function VampireMouth({ config, palette }) {
  const color = config.mouth_color || palette.skin.deep;
  return (
    <g data-avatar-variant="mouth:vampire" className="avatar-mouth-vampire">
      <path d="M106 108 C114 105 128 105 136 108 C134 120 128 124 121 124 C113 124 108 118 106 108 Z" fill={color} stroke={palette.skin.outline} strokeWidth="1.8" />
      <path className="avatar-highlight" d="M109 108 C116 106 127 106 133 108 L132 113 C125 115 115 115 110 112 Z" fill={TOOTH_WHITE} />
      <path d="M111 110 L116 111 L114 120 Z M127 111 L132 109 L129 120 Z" fill={TOOTH_WHITE} stroke="#d8cfd0" strokeWidth="0.5" strokeLinejoin="round" />
      <path d="M115 121 C119 118 125 118 129 121 C124 124 119 125 115 121 Z" fill={palette.skin.cheek} opacity="0.75" />
    </g>
  );
}

export function WhistleMouth({ config, palette }) {
  const color = config.mouth_color || palette.skin.outline;
  return (
    <g data-avatar-variant="mouth:whistle" className="avatar-mouth-whistle">
      <ellipse cx="121" cy="114" rx="4.8" ry="4.1" fill={color} />
      <ellipse cx="122" cy="113" rx="2.2" ry="1.7" fill={palette.skin.deep} />
      <path className="avatar-face-plane" d="M111 110 C114 112 115 116 112 119 M131 109 C128 112 128 116 131 119" fill="none" stroke={palette.skin.cheek} strokeWidth="1.5" strokeLinecap="round" opacity="0.62" />
      <path className="avatar-highlight" d="M119 111 C120 110 122 110 123 111" fill="none" stroke="#ffffff" strokeWidth="0.9" strokeLinecap="round" opacity="0.7" />
    </g>
  );
}

export function MaskMouth({ config, palette }) {
  const color = config.mouth_color || palette.outfit.base;
  return (
    <g data-avatar-variant="mouth:mask" className="avatar-mouth-mask" data-avatar-mouth-overlay="mask">
      <path d="M84 101 C91 104 94 108 96 112 M156 101 C149 104 146 108 144 112" fill="none" stroke={palette.skin.outline} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M95 101 C107 98 134 98 146 102 L143 124 C132 134 108 134 98 123 Z" fill={color} stroke={palette.skin.outline} strokeWidth="2.4" strokeLinejoin="round" />
      <path className="avatar-highlight" d="M101 105 C112 103 130 103 140 105" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.52" />
      <path className="avatar-detail" d="M100 111 C112 114 130 114 142 111 M99 118 C112 121 130 121 143 118" fill="none" stroke={palette.skin.outline} strokeWidth="1.4" strokeLinecap="round" opacity="0.56" />
    </g>
  );
}

export function BeardMouth({ config, palette }) {
  const color = config.mouth_color || palette.skin.highlight;
  return (
    <g data-avatar-variant="mouth:beard" className="avatar-mouth-beard">
      <g className="avatar-facial-hair avatar-beard" data-avatar-mouth-overlay="facial-hair">
        <path d="M94 101 C101 104 106 104 111 102 C114 108 128 108 132 102 C138 104 143 104 149 101 L147 119 C143 135 132 144 121 145 C109 144 98 135 95 119 Z" fill={palette.hair.base} stroke={palette.hair.outline} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M100 110 C105 117 111 123 116 132 M142 110 C138 118 132 125 126 134 M120 111 L121 140" fill="none" stroke={palette.hair.shadow} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <path className="avatar-highlight" d="M103 108 C108 112 112 116 115 121 M134 110 C131 114 128 118 126 123" fill="none" stroke={palette.hair.light} strokeWidth="1.5" strokeLinecap="round" opacity="0.62" />
      </g>
      <path className="avatar-detail" d="M111 112 C117 119 128 119 134 111" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </g>
  );
}

export function MoustacheMouth({ config, palette }) {
  const color = config.mouth_color || palette.skin.outline;
  return (
    <g data-avatar-variant="mouth:moustache" className="avatar-mouth-moustache">
      <g className="avatar-facial-hair avatar-moustache" data-avatar-mouth-overlay="facial-hair">
        <path d="M120 106 C115 101 106 100 101 106 C105 106 107 109 104 112 C110 115 117 113 121 108 Z" fill={palette.hair.base} stroke={palette.hair.outline} strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M122 106 C127 101 136 100 141 106 C137 106 135 109 138 112 C132 115 125 113 121 108 Z" fill={palette.hair.base} stroke={palette.hair.outline} strokeWidth="1.6" strokeLinejoin="round" />
        <path className="avatar-highlight" d="M108 105 C112 104 116 106 118 108 M134 105 C130 104 126 106 124 108" fill="none" stroke={palette.hair.light} strokeWidth="1" strokeLinecap="round" opacity="0.55" />
      </g>
      <path className="avatar-detail" d="M113 116 C119 120 126 120 131 115" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

export function EmptyPart({ config, palette }) {
  void config;
  void palette;
  return null;
}

export function Freckles({ config, palette }) {
  const color = config.mouth_color || palette.skin.deep;
  return (
    <g data-avatar-variant="face:freckles" className="avatar-face-freckles" opacity="0.78">
      <circle cx="86" cy="101" r="1.7" fill={color} />
      <circle cx="91" cy="104" r="1.45" fill={color} />
      <circle cx="96" cy="101" r="1.6" fill={color} />
      <circle cx="101" cy="105" r="1.25" fill={color} />
      <circle cx="139" cy="105" r="1.25" fill={color} />
      <circle cx="144" cy="101" r="1.6" fill={color} />
      <circle cx="149" cy="104" r="1.45" fill={color} />
      <circle cx="154" cy="101" r="1.7" fill={color} />
    </g>
  );
}

export function Blush({ config, palette }) {
  return (
    <g data-avatar-variant="face:blush" className="avatar-face-blush" data-face-tone={config.head_color || palette.skin.base}>
      <ellipse cx="90" cy="103" rx="12" ry="6.2" fill={palette.skin.cheek} opacity="0.68" />
      <ellipse cx="150" cy="103" rx="12" ry="6.2" fill={palette.skin.cheek} opacity="0.68" />
      <path className="avatar-highlight" d="M82 103 L87 100 M89 105 L94 102 M97 104 L100 102 M140 103 L145 100 M148 105 L153 102 M156 104 L159 102" fill="none" stroke={palette.skin.highlight} strokeWidth="1.5" strokeLinecap="round" opacity="0.76" />
    </g>
  );
}

export function FacePaint({ config, palette }) {
  return (
    <g data-avatar-variant="face:face_paint" className="avatar-face-paint" data-face-tone={config.head_color || palette.skin.base}>
      <path d="M82 91 C90 89 98 91 104 95 L101 101 C94 98 87 97 81 99 Z" fill="#ee5267" stroke={palette.skin.outline} strokeWidth="0.8" opacity="0.82" />
      <path d="M82 101 C89 99 96 101 101 104 L98 109 C91 107 86 106 81 108 Z" fill="#3f8cff" stroke={palette.skin.outline} strokeWidth="0.8" opacity="0.82" />
      <path d="M138 95 C144 91 152 89 160 91 L161 99 C155 97 148 98 141 101 Z" fill="#ee5267" stroke={palette.skin.outline} strokeWidth="0.8" opacity="0.82" />
      <path d="M141 104 C146 101 153 99 160 101 L160 108 C155 106 150 107 143 109 Z" fill="#3f8cff" stroke={palette.skin.outline} strokeWidth="0.8" opacity="0.82" />
    </g>
  );
}

export function Scar({ config, palette }) {
  return (
    <g data-avatar-variant="face:scar" className="avatar-face-scar" data-face-tone={config.head_color || palette.skin.base}>
      <path d="M145 96 C151 100 148 106 155 113" fill="none" stroke="#983747" strokeWidth="3.1" strokeLinecap="round" opacity="0.94" />
      <path d="M143 101 L151 100 M146 106 L153 105 M149 111 L156 109" fill="none" stroke={palette.skin.deep} strokeWidth="1.5" strokeLinecap="round" opacity="0.84" />
    </g>
  );
}

export function Bandage({ config, palette }) {
  return (
    <g data-avatar-variant="face:bandage" className="avatar-face-bandage" data-face-tone={config.head_color || palette.skin.base} transform="rotate(-10 145 97)">
      <rect x="134" y="91" width="23" height="12" rx="4" fill="#f1d2ad" stroke={palette.skin.outline} strokeWidth="1.4" />
      <rect x="141" y="93" width="9" height="8" rx="2" fill="#dfb78e" opacity="0.8" />
      <circle cx="137.5" cy="95" r="0.9" fill="#b98d69" />
      <circle cx="153.5" cy="99" r="0.9" fill="#b98d69" />
      <path className="avatar-highlight" d="M138 93 L144 92" fill="none" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
    </g>
  );
}

export function Stickers({ config, palette }) {
  return (
    <g data-avatar-variant="face:stickers" className="avatar-face-stickers" data-face-tone={config.head_color || palette.skin.base}>
      <path d="M91 88 L93.5 94 L100 94.5 L95 98.5 L96.5 105 L91 101.5 L85.5 105 L87 98.5 L82 94.5 L88.5 94 Z" fill="#ffd84d" stroke="#b77a13" strokeWidth="1" strokeLinejoin="round" />
      <path d="M149 106 C145 101 139 98 139 93 C139 88 146 87 149 92 C152 87 159 88 159 93 C159 98 153 102 149 106 Z" fill="#f36fa0" stroke="#a63a68" strokeWidth="1" />
      <circle className="avatar-highlight" cx="89" cy="94" r="1" fill="#ffffff" opacity="0.8" />
    </g>
  );
}

export function RuneMarks({ config, palette }) {
  return (
    <g data-avatar-variant="face:rune_marks" className="avatar-face-runes" data-face-tone={config.head_color || palette.skin.base}>
      <path d="M85 82 L97 76 L93 91 Z M89 80 L92 88" fill="none" stroke="#9b7cff" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M149 78 L142 91 L155 86 M145 83 L152 92" fill="none" stroke="#45d8da" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="88" cy="101" r="2" fill="#9b7cff" opacity="0.72" />
      <circle cx="153" cy="100" r="2" fill="#45d8da" opacity="0.72" />
    </g>
  );
}

export function Whiskers({ config, palette }) {
  const color = config.mouth_color || palette.skin.outline;
  return (
    <g data-avatar-variant="face:whiskers" className="avatar-face-whiskers" opacity="0.74">
      <path d="M77 97 L101 101 M76 104 L101 105 M79 111 L101 109" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M141 101 L164 97 M141 105 L165 104 M141 109 L162 112" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <path className="avatar-highlight" d="M80 96 L89 98 M153 99 L162 97" fill="none" stroke={palette.skin.highlight} strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
    </g>
  );
}

export function MischiefMark({ config, palette }) {
  return (
    <g data-avatar-variant="face:mischief_mark" className="avatar-face-mischief" data-face-tone={config.head_color || palette.skin.base}>
      <path d="M148 70 C158 71 158 80 151 82 C160 83 159 94 151 95 C157 99 154 106 147 104" fill="none" stroke="#e15fba" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M89 90 L95 96 L89 102 L83 96 Z" fill="#8e57df" stroke="#5c2a9d" strokeWidth="1.2" />
      <circle className="avatar-highlight" cx="87.5" cy="94.5" r="1" fill="#ffffff" opacity="0.7" />
    </g>
  );
}

export const EYE_RENDERERS = Object.freeze({
  normal: NormalEyes,
  happy: HappyEyes,
  wide: WideEyes,
  sleepy: SleepyEyes,
  wink: WinkEyes,
  angry: AngryEyes,
  dot: DotEyes,
  star: StarEyes,
  glasses: GlassesEyes,
  sunglasses: SunglassesEyes,
  eye_patch: EyePatchEyes,
  crying: CryingEyes,
  heart_eyes: HeartEyes,
  dizzy: DizzyEyes,
  closed: ClosedEyes,
});

export const MOUTH_RENDERERS = Object.freeze({
  smile: SmileMouth,
  grin: GrinMouth,
  neutral: NeutralMouth,
  open: OpenMouth,
  tongue: TongueMouth,
  frown: FrownMouth,
  surprised: SurprisedMouth,
  smirk: SmirkMouth,
  braces: BracesMouth,
  vampire: VampireMouth,
  whistle: WhistleMouth,
  mask: MaskMouth,
  beard: BeardMouth,
  moustache: MoustacheMouth,
});

export const FACE_EXTRA_RENDERERS = Object.freeze({
  none: EmptyPart,
  freckles: Freckles,
  blush: Blush,
  face_paint: FacePaint,
  scar: Scar,
  bandage: Bandage,
  stickers: Stickers,
  rune_marks: RuneMarks,
  whiskers: Whiskers,
  mischief_mark: MischiefMark,
});
