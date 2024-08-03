<script lang="ts">
  import P5 from 'p5-svelte'
  import type { Sketch } from 'p5-svelte'

  let insideRadius = 100
  let outsideRadius = 150

  const sketch: Sketch = p5 => {
    p5.setup = () => {
      p5.createCanvas(720, 400)
      p5.angleMode(p5.DEGREES)
      p5.colorMode(p5.HSB, 360, 255, 255)

      p5.describe('Rainbow ring made up of triangles whose vertices lie on two concentric circles.')
    }

    p5.draw = () => {
      p5.background(0)

      let centerX = p5.width / 2
      let centerY = p5.height / 2

      // Set the number of points based on the mouse x position
      let pointCount = p5.map(p5.mouseX, 0, p5.width, 6, 60)

      // Round pointCount to the nearest integer
      pointCount = p5.round(pointCount)

      // Display the current pointCount
      p5.fill(255)
      p5.textSize(20)
      p5.text(`pointCount: ${pointCount}`, 30, 30)

      // Draw the triangle strip by specifying points on
      // the inside circle and outside circle alternately

      let angle = 0
      let angleStep = 180.0 / pointCount

      p5.beginShape(p5.TRIANGLE_STRIP)
      for (let i = 0; i <= pointCount; i += 1) {
        // Specify a point on the outside circle
        let pointX = centerX + p5.cos(angle) * outsideRadius
        let pointY = centerY + p5.sin(angle) * outsideRadius
        p5.fill(angle, 255, 255)
        p5.vertex(pointX, pointY)
        angle += angleStep

        // Specify a point on the inside circle
        pointX = centerX + p5.cos(angle) * insideRadius
        pointY = centerY + p5.sin(angle) * insideRadius
        p5.fill(angle, 255, 255)
        p5.vertex(pointX, pointY)
        angle += angleStep
      }
      p5.endShape()
    }
  }
</script>

<P5 {sketch} />
