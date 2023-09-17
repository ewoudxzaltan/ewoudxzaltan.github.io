<script>
  function changeHue(image, hueValue) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0, image.width, image.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      // Convert RGB to HSL
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const hsl = rgbToHsl(r, g, b);

      // Modify the hue
      hsl[0] = (hsl[0] + hueValue) % 360;

      // Convert HSL back to RGB
      const rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);

      // Update the pixel data
      data[i] = rgb[0];
      data[i + 1] = rgb[1];
      data[i + 2] = rgb[2];
    }

    ctx.putImageData(imageData, 0, 0);
    image.src = canvas.toDataURL();
  }

  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  }

  function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [r * 255, g * 255, b * 255];
  }

  const image = new Image(); // Create an image element
  image.src = "images/speaker_cut_out1.png"; // Set the image source

  image.onload = () => {
    const hueSlider = document.getElementById("hueSlider");

    function autoChangeHue(hueValue) {
      changeHue(image, hueValue);
      hueSlider.value = hueValue;

      setTimeout(() => {
        hueValue = (hueValue + 0.5) % 360; // Slower animation, adjust as needed
        autoChangeHue(hueValue);
      }, 150); // Change hue every 150 milliseconds (adjust as needed)
    }

    autoChangeHue(0);
  };
</script>
