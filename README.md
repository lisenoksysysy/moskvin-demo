# MOSKWIN Coffee Shop

Сайт кофейни MOSKWIN, подготовленный для репозитория GitHub `moskvin-demo` и публикации в GitHub Pages.

Стек проекта — HTML, CSS и JavaScript. Изображения и шрифты находятся в `media/`. Меню хранится в `menu-data.js`.

Для сборки установите Node.js 24 и выполните из корня проекта

```sh
npm ci
npm run build
```

Готовые файлы появятся в `dist/`. Сборка копирует HTML, CSS, JavaScript и ресурсы. Относительные ссылки позволяют открывать сайт по пути `/moskvin-demo/`.

Для публикации

1. Создайте в GitHub репозиторий `moskvin-demo`. Загрузите в ветку `main` содержимое этой папки, включая `.github/`, `scripts/`, `media/` и файлы `package.json` и `package-lock.json`.
2. В настройках репозитория откройте **Settings → Pages → Build and deployment** и выберите **Source → GitHub Actions**.
3. Откройте **Actions → Deploy to GitHub Pages → Run workflow**, чтобы запустить первую публикацию после настройки Pages.

При последующих изменениях ветки `main` workflow автоматически выполнит `npm ci`, `npm run build` и опубликует папку `dist/`. Адрес опубликованного сайта GitHub покажет в **Settings → Pages** и в результате workflow.

Для перехода прямо к меню используйте адрес сайта с окончанием `/moskvin-demo/#menu`.
