# Elvis Yi Lighting Portfolio

This is a static portfolio website for lighting design projects. It is designed for GitHub Pages and does not need a backend.

## Project Folder Structure

Each project has one folder inside `project-assets/`.

Each project folder should contain only these two subfolders:

```text
project-assets/
  beijing-popland-theme-park-2022/
    cover/
      cover.jpg
    pdf/
      lighting-plan.pdf
      fixture-layout.pdf
      paperwork.pdf
```

Use this pattern for every project:

```text
project-assets/project-id/cover/
project-assets/project-id/pdf/
```

## Cover Image

Each project should have only one cover image.

Put it here:

```text
project-assets/project-id/cover/cover.jpg
```

The website will automatically try these filenames:

```text
cover.jpg
cover.png
cover.jpeg
cover.webp
```

For example, both of these work:

```text
project-assets/universal-beijing-theme-park-2019-minion-land/cover/cover.jpg
project-assets/universal-beijing-theme-park-2019-transformer/cover/cover.png
```

Usually you can leave `cover` empty in `data/projects.js`. Only fill it if you want to use a different filename.

## Multiple PDF Drawings

Put all PDF drawings here:

```text
project-assets/project-id/pdf/
```

Then add each PDF to the `pdfs` list in `data/projects.js`:

```js
pdfs: [
  {
    title: { en: "Lighting Plan", zh: "灯光图" },
    file: "project-assets/beijing-popland-theme-park-2022/pdf/lighting-plan.pdf"
  },
  {
    title: { en: "Fixture Layout", zh: "灯具布局图" },
    file: "project-assets/beijing-popland-theme-park-2022/pdf/fixture-layout.pdf"
  }
],
```

The project page will automatically show PDF selection buttons. Visitors can choose which PDF to preview.

## Chinese and English Text

Most project text supports both languages:

```js
title: { en: "Beijing Popland Theme Park", zh: "北京 Popland 主题公园" },
summary: {
  en: "Theme park lighting project in Beijing.",
  zh: "北京主题公园灯光项目。"
}
```

The language switch on the website will use these fields automatically.

## Change Filters

Edit this line in `data/projects.js`:

```js
window.PORTFOLIO_FILTERS = ["All", "Theme Park", "Ceremony", "Show", "Concert"];
```

## Contact Link

Replace `hello@example.com` in `index.html` and `project.html` with the email address you want to use.
