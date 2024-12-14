import subprocess

def compress_video(input_file, output_file, crf=23, preset="medium"):
    """
    Стискає відео за допомогою FFmpeg.

    :param input_file: Шлях до вхідного відео.
    :param output_file: Шлях до стисненого відео.
    :param crf: Значення "Constant Rate Factor" (0-51, менше = якісніше).
    :param preset: Профіль швидкості (ultrafast, superfast, fast, medium, slow, slower, veryslow).
    """
    try:
        command = [
            "ffmpeg",
            "-i", input_file,  # Вхідний файл
            "-vcodec", "libx264",  # Кодек для відео
            "-crf", str(crf),  # Рівень якості
            "-preset", preset,  # Швидкість стиснення
            "-acodec", "aac",  # Кодек для аудіо
            "-b:a", "128k",  # Бітрейт аудіо
            "-movflags", "+faststart",  # Оптимізація для потокового відео
            output_file
        ]
        subprocess.run(command, check=True)
        print(f"Стиснення завершено. Стиснене відео збережено як {output_file}")
    except subprocess.CalledProcessError as e:
        print(f"Помилка під час стиснення відео: {e}")
    except FileNotFoundError:
        print("FFmpeg не встановлено або недоступно в PATH.")

# Використання функції
input_path = "input_video.mp4"  # Шлях до вашого відео
output_path = "compressed_video.mp4"  # Шлях до стисненого відео

compress_video(input_path, output_path, crf=28, preset="slow")
