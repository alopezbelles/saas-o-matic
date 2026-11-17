function luminance(color) {
  const values = color
    .match(/[\d.]+/g)
    .slice(0, 3)
    .map(Number)
    .map((channel) => {
      const value = channel / 255;
      return value <= 0.04045
        ? value / 12.92
        : ((value + 0.055) / 1.055) ** 2.4;
    });
  return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
}
export function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}
export async function colors(locator) {
  return locator.evaluate((element) => {
    const style = globalThis.getComputedStyle(element);
    let current = element;
    let background;
    while (current) {
      const color = globalThis.getComputedStyle(current).backgroundColor;
      if (color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') {
        background = color;
        break;
      }
      current = current.parentElement;
    }
    return {
      color: style.color,
      border: style.borderTopColor,
      outline: style.outlineColor,
      background: background ?? 'rgb(255, 255, 255)',
    };
  });
}
