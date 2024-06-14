
Сервер запускается на порту 3000 
cd ./server
npm run start
затем фронтенд(baseApi к порту 3000)
cd /
npm run dev
Фулл-стек приложение Next + Nest. Есть дневные тодо, есть недельные. В недельном списке если поменять тодо, привязанный к конкретному дню, в дневном списке отразятся изменения. Серверная часть написана на Nest(в папке server, которая в корневой директории). Данные хранятся только в БД на Vercel, поэтмоу даже при снятии чекбокса идет PUT-запрос на сервер, инвалидируется соответствующий тег, и только тогда на фронте обновляется список. Есть идея пока компонент открыт, обновлять все на фронте, и только при размонтировании отправлять один большой PUT-запрос. Ну это я в отдельной ветке реализую 

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
