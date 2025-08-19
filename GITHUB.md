# Публикация на GitHub (очень просто)

## Вариант A — через сайт (без программ)
1. Создай репозиторий: github.com → нажми «+» → **New repository** → название, например `ai-learning-mvp` → **Public** → **Create**.
2. Нажми **Add file → Upload files** и перетащи СОДЕРЖИМОЕ распакованной папки проекта (не сам ZIP).
3. Нажми **Commit changes**.

### Включаем GitHub Pages
1. В репозитории открой **Settings → Pages**.
2. В разделе **Build and deployment** выбери: Source = **Deploy from a branch**.
3. Branch = **main** и папка = **/** (root). Сохрани.
4. Через минуту появится ссылка вида: `https://<твой-логин>.github.io/ai-learning-mvp`.

---

## Вариант B — через GitHub Desktop (удобно)
1. Установи GitHub Desktop и войди в аккаунт.
2. **File → New repository…** → выбери папку проекта → **Create repository**.
3. Нажми **Publish repository** (Public).
4. Потом: меняешь файлы → **Commit to main** → **Push origin** → сайт обновится.

---

## Важно
- Не загружай `node_modules` и `dist`.
- При запуске локально:
  ```
  npm install
  npm run dev -- --host
  ```
