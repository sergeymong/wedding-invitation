#!/usr/bin/env python3
"""
Удаление магента-фона (#FF00FF) из изображений.

Использование:
  python remove-bg.py input.png output.png
  python remove-bg.py input.png  # сохранит в input_transparent.png
"""

import sys
from PIL import Image
import numpy as np

def remove_magenta_bg(input_path, output_path=None):
    if output_path is None:
        output_path = input_path.replace('.png', '_transparent.png')
    
    img = Image.open(input_path).convert('RGBA')
    data = np.array(img)
    h, w = data.shape[:2]
    
    r, g, b = data[:,:,0].astype(int), data[:,:,1].astype(int), data[:,:,2].astype(int)
    
    # Розовый/магента фон: высокий R, низкий G, высокий B
    is_magenta = (r > 150) & (g < 120) & (b > 150)
    
    data[:,:,3] = np.where(is_magenta, 0, 255)
    
    # Удаляем значок Gemini в правом нижнем углу
    data[h-100:, w-100:, 3] = 0
    
    result = Image.fromarray(data)
    result.save(output_path, 'PNG')
    print(f"Saved: {output_path}")
    return output_path

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    remove_magenta_bg(input_file, output_file)
