var size_luminance = d3.scale
  .sqrt()
  .domain([0, 1e9])
  .clamp(true)
  .range([90, 20])

const depth_luminance = d3.scale
  .linear() // .sqrt()
  .domain([0, 11])
  .clamp(true)
  .range([75, 96])

const colorScale = d3.scale
// .linear()
// .range(['purple', 'orange']) // "steelblue", "brown pink orange green", "blue"
// .domain([1e2, 1e9])
// .interpolate(d3.interpolateLab) // interpolateHcl

const greyScale = d3.scale
  .linear()
  // .range(['white', 'black'])
  .range(['black', 'white'])
  .domain([0, 12])
  .interpolate(d3.interpolateLab)

const fill =
  // size
  // fillByParentName
  // colorByParent
  // byExtension
  byProp

function byProp(d) {
  return d.color
}

const ext = /\.\w+$/

function byExtension(d, def) {
  const m = ext.exec(d.name)
  if (m && m in extension_map) {
    return extension_map[m]
  }

  return def ? null : d3.rgb(0, 0, 0)
}

function size(d) {
  // const c = d3.lab(hue(d.name))
  const c = greyScale(d.depth)
  c.l = size_luminance(d.value)
  return c
}

function colorByParent(d) {
  let p = d
  while (p.depth > 1) p = p.parent
  // var c = d3.lab(hue(p.sum)); // size
  // var c = d3.lab(hue(p.count));
  // var c = d3.lab(hue(p.name))
  const c = d3.lab(hue(p.children ? p.children.length : 0))
  // c.l = luminance(d.value)
  c.l = depth_luminance(d.depth)

  return c
}

function fillByParentName(d) {
  let p = d
  while (p.depth > 1) p = p.parent
  c.l = size_luminance(d.sum || d.value)
  return c
}

var _color_cache = new Map()
function color_cache(x) {
  if (!_color_cache.has(x)) {
    _color_cache.set(x, colorScale(x))
  }

  return _color_cache.get(x)
}

const color_reg = /(\.\w+)\W+00;38;5;(\d+)/
const extension_map = {}

// https://github.com/seebi/dircolors-solarized
const SOLARIZED = {}
// SOLARIZED HEX     16/8 TERMCOL  XTERM/HEX   L*A*B      sRGB        HSB
// --------- ------- ---- -------  ----------- ---------- ----------- -----------
;`
base03    #002b36  8/4 brblack  234 #1c1c1c 15 -12 -12   0  43  54 193 100  21
base02    #073642  0/4 black    235 #262626 20 -12 -12   7  54  66 192  90  26
base01    #586e75 10/7 brgreen  240 #4e4e4e 45 -07 -07  88 110 117 194  25  46
base00    #657b83 11/7 bryellow 241 #585858 50 -07 -07 101 123 131 195  23  51
base0     #839496 12/6 brblue   244 #808080 60 -06 -03 131 148 150 186  13  59
base1     #93a1a1 14/4 brcyan   245 #8a8a8a 65 -05 -02 147 161 161 180   9  63
base2     #eee8d5  7/7 white    254 #d7d7af 92 -00  10 238 232 213  44  11  93
base3     #fdf6e3 15/7 brwhite  230 #ffffd7 97  00  10 253 246 227  44  10  99
yellow    #b58900  3/3 yellow   136 #af8700 60  10  65 181 137   0  45 100  71
orange    #cb4b16  9/3 brred    166 #d75f00 50  50  55 203  75  22  18  89  80
red       #dc322f  1/1 red      160 #d70000 50  65  45 220  50  47   1  79  86
magenta   #d33682  5/5 magenta  125 #af005f 50  65 -05 211  54 130 331  74  83
violet    #6c71c4 13/5 brmagenta 61 #5f5faf 50  15 -45 108 113 196 237  45  77
blue      #268bd2  4/4 blue      33 #0087ff 55 -10 -45  38 139 210 205  82  82
cyan      #2aa198  6/6 cyan      37 #00afaf 60 -35 -05  42 161 152 175  74  63
green     #859900  2/2 green     64 #5f8700 60 -20  65 133 153   0  68 100  60
`
  .split('\n')
  .forEach(v => {
    const parts = v.split(/\W+/)
    if (parts.length < 4) return
    // SOLARIZED[parts[5]] = '#' + parts[6]
    // SOLARIZED[parts[5]] = '#' + parts[1];
    SOLARIZED[parts[5]] = d3.lab(parts[7], parts[8], parts[9])
  })

// https://github.com/seebi/dircolors-solarized/blob/master/dircolors.256dark
const DIRCOLORS = `
## Archives or compressed (violet + bold for compression)
.tar    00;38;5;61
.tgz    00;38;5;61
.arj    00;38;5;61
.taz    00;38;5;61
.lzh    00;38;5;61
.lzma   00;38;5;61
.tlz    00;38;5;61
.txz    00;38;5;61
.zip    00;38;5;61
.z      00;38;5;61
.Z      00;38;5;61
.dz     00;38;5;61
.gz     00;38;5;61
.lz     00;38;5;61
.xz     00;38;5;61
.bz2    00;38;5;61
.bz     00;38;5;61
.tbz    00;38;5;61
.tbz2   00;38;5;61
.tz     00;38;5;61
.deb    00;38;5;61
.rpm    00;38;5;61
.jar    00;38;5;61
.rar    00;38;5;61
.ace    00;38;5;61
.zoo    00;38;5;61
.cpio   00;38;5;61
.7z     00;38;5;61
.rz     00;38;5;61
.apk    00;38;5;61
.gem    00;38;5;61

# Image formats (yellow)
.jpg    00;38;5;136
.JPG    00;38;5;136 #stupid but needed
.jpeg   00;38;5;136
.gif    00;38;5;136
.bmp    00;38;5;136
.pbm    00;38;5;136
.pgm    00;38;5;136
.ppm    00;38;5;136
.tga    00;38;5;136
.xbm    00;38;5;136
.xpm    00;38;5;136
.tif    00;38;5;136
.tiff   00;38;5;136
.png    00;38;5;136
.PNG    00;38;5;136
.svg    00;38;5;136
.svgz   00;38;5;136
.mng    00;38;5;136
.pcx    00;38;5;136
.dl     00;38;5;136
.xcf    00;38;5;136
.xwd    00;38;5;136
.yuv    00;38;5;136
.cgm    00;38;5;136
.emf    00;38;5;136
.eps    00;38;5;136
.CR2    00;38;5;136
.ico    00;38;5;136

# Files of special interest (base1)
.tex             00;38;5;245
.rdf             00;38;5;245
.owl             00;38;5;245
.n3              00;38;5;245
.ttl             00;38;5;245
.nt              00;38;5;245
.torrent         00;38;5;245
.xml             00;38;5;245
*Makefile        00;38;5;245
*Rakefile        00;38;5;245
*Dockerfile      00;38;5;245
*build.xml       00;38;5;245
*rc              00;38;5;245
*1               00;38;5;245
.nfo             00;38;5;245
*README          00;38;5;245
*README.txt      00;38;5;245
*readme.txt      00;38;5;245
.md              00;38;5;245
*README.markdown 00;38;5;245
.ini             00;38;5;245
.yml             00;38;5;245
.cfg             00;38;5;245
.conf            00;38;5;245
.h               00;38;5;245
.hpp             00;38;5;245
.c               00;38;5;245
.cpp             00;38;5;245
.cxx             00;38;5;245
.cc              00;38;5;245
.objc            00;38;5;245
.sqlite          00;38;5;245
.go              00;38;5;245
.sql             00;38;5;245
.csv             00;38;5;245

# "unimportant" files as logs and backups (base01)
.log        00;38;5;240
.bak        00;38;5;240
.aux        00;38;5;240
.lof        00;38;5;240
.lol        00;38;5;240
.lot        00;38;5;240
.out        00;38;5;240
.toc        00;38;5;240
.bbl        00;38;5;240
.blg        00;38;5;240
*~          00;38;5;240
*#          00;38;5;240
.part       00;38;5;240
.incomplete 00;38;5;240
.swp        00;38;5;240
.tmp        00;38;5;240
.temp       00;38;5;240
.o          00;38;5;240
.pyc        00;38;5;240
.class      00;38;5;240
.cache      00;38;5;240

# Audio formats (orange)
.aac    00;38;5;166
.au     00;38;5;166
.flac   00;38;5;166
.mid    00;38;5;166
.midi   00;38;5;166
.mka    00;38;5;166
.mp3    00;38;5;166
.mpc    00;38;5;166
.ogg    00;38;5;166
.opus   00;38;5;166
.ra     00;38;5;166
.wav    00;38;5;166
.m4a    00;38;5;166
# http://wiki.xiph.org/index.php/MIME_Types_and_File_Extensions
.axa    00;38;5;166
.oga    00;38;5;166
.spx    00;38;5;166
.xspf   00;38;5;166

# Video formats (as audio + bold)
.mov    00;38;5;166
.MOV    00;38;5;166
.mpg    00;38;5;166
.mpeg   00;38;5;166
.m2v    00;38;5;166
.mkv    00;38;5;166
.ogm    00;38;5;166
.mp4    00;38;5;166
.m4v    00;38;5;166
.mp4v   00;38;5;166
.vob    00;38;5;166
.qt     00;38;5;166
.nuv    00;38;5;166
.wmv    00;38;5;166
.asf    00;38;5;166
.rm     00;38;5;166
.rmvb   00;38;5;166
.flc    00;38;5;166
.avi    00;38;5;166
.fli    00;38;5;166
.flv    00;38;5;166
.gl     00;38;5;166
.m2ts   00;38;5;166
.divx   00;38;5;166
.webm   00;38;5;166
# http://wiki.xiph.org/index.php/MIME_Types_and_File_Extensions
.axv 00;38;5;166
.anx 00;38;5;166
.ogv 00;38;5;166
.ogx 00;38;5;166
`
  .split('\n')
  .forEach(line => {
    const m = color_reg.exec(line)
    if (m) {
      const key = m[2]

      extension_map[m[1]] = SOLARIZED[key]
    }
  })

console.log(extension_map, SOLARIZED)

function colorByTypes(data) {
  childrenFirst(data, node => {
    const color = byExtension(node, true)
    if (color) {
      node.color = color
      return
    }

    const { children } = node
    const len = children && children.length
    if (!children || !len ) {
      node.color = d3.lab(80, 0, 0)
      return
    }

    const v = (node.sum || node.value || node.size);
    if (!v) {
      node.color = d3.lab(50, 0, 0)
      return
    }

    let l = 0
    let a = 0
    let b = 0

    /*
    for (let i = 0; i < len; i++) {
      const c = children[i].color
      l += c.l
      a += c.a
      b += c.b
    }

    // weighted by average
    l /= len
    a /= len
    b /= len
    */

    // weighted by sizes
    for (let i = 0; i < len; i++) {
      const child = children[i];
      const color = child.color
      if (!v) console.log('warn', node);
      const weight = child.sum / v
      l += (color.l * weight)
      a += (color.a * weight)
      b += (color.b * weight)
    }

    node.color = d3.lab(l, a, b)
  })
}

function childrenFirst(data, func) {
  const { children } = data
  if (children) {
    children.forEach(v => {
      childrenFirst(v, func)
    })
  }

  func(data)
}
