import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const repoRoot = process.cwd()
const inputSvg = path.join(repoRoot, 'public', 'flame-icon.svg')
const outDir = path.join(repoRoot, 'public', 'icons')

const targets = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'maskable-192.png', size: 192 },
  { name: 'maskable-512.png', size: 512 },
]

async function main() {
  if (!fs.existsSync(inputSvg)) {
    throw new Error(`Missing source icon: ${inputSvg}`)
  }

  fs.mkdirSync(outDir, { recursive: true })

  const svgBuffer = fs.readFileSync(inputSvg)

  await Promise.all(
    targets.map(async ({ name, size }) => {
      const outPath = path.join(outDir, name)

      // For "maskable" icons, give the graphic breathing room with padding.
      const isMaskable = name.startsWith('maskable-')
      const padding = isMaskable ? Math.round(size * 0.1) : 0
      const innerSize = size - padding * 2

      const img = sharp(svgBuffer, { density: 512 })
        .resize(innerSize, innerSize, { fit: 'contain', withoutEnlargement: false })

      const composed = isMaskable
        ? sharp({
            create: {
              width: size,
              height: size,
              channels: 4,
              background: { r: 255, g: 255, b: 255, alpha: 0 },
            },
          }).composite([{ input: await img.png().toBuffer(), left: padding, top: padding }])
        : img

      await composed.png({ compressionLevel: 9 }).toFile(outPath)
    })
  )

  console.log(`Generated PWA icons in: ${outDir}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
