#!/usr/bin/env python3
import sys
from PIL import Image


def process_image(input_path: str, output_path: str) -> bool:
    try:
        with Image.open(input_path) as im:
            if im.mode in ("RGBA", "LA", "P"):
                im = im.convert("RGB")
            im.save(output_path, "WEBP", quality=85, method=6)
        return True
    except Exception as e:
        print(f"PIL_ERROR: {e}", file=sys.stderr)
        return False


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 image_processor.py <input_path> <output_path>", file=sys.stderr)
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2]

    ok = process_image(input_file, output_file)
    sys.exit(0 if ok else 1)
