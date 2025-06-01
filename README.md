This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Project Structure

```
# Project Structure - Domain Driven Architecture

```

src/
├── app/ # Next.js App Router
│ ├── (auth)/
│ │ ├── login/
│ │ │ └── page.tsx
│ │ └── layout.tsx
│ ├── (user)/
│ │ ├── dashboard/
│ │ │ └── page.tsx
│ │ ├── photo-download/
│ │ │ └── page.tsx
│ │ ├── photo-edit-request/
│ │ │ └── page.tsx
│ │ ├── video-edit-request/
│ │ │ └── page.tsx
│ │ ├── text-request/
│ │ │ └── page.tsx
│ │ ├── chat/
│ │ │ └── page.tsx
│ │ ├── gift/
│ │ │ └── page.tsx
│ │ ├── pdf-request/
│ │ │ └── page.tsx
│ │ └── layout.tsx
│ ├── (admin)/
│ │ ├── admin-dashboard/
│ │ │ └── page.tsx
│ │ ├── photo-management/
│ │ │ └── page.tsx
│ │ ├── request-management/
│ │ │ └── page.tsx
│ │ ├── user-management/
│ │ │ └── page.tsx
│ │ ├── payment-management/
│ │ │ └── page.tsx
│ │ ├── admin-chat/
│ │ │ └── page.tsx
│ │ └── layout.tsx
│ ├── api/
│ │ ├── auth/
│ │ │ ├── login/
│ │ │ │ └── route.ts
│ │ │ └── me/
│ │ │ └── route.ts
│ │ ├── users/
│ │ │ └── route.ts
│ │ ├── requests/
│ │ │ ├── route.ts
│ │ │ └── [id]/
│ │ │ └── route.ts
│ │ ├── photos/
│ │ │ ├── route.ts
│ │ │ └── [id]/
│ │ │ └── route.ts
│ │ ├── chat/
│ │ │ └── route.ts
│ │ ├── gifts/
│ │ │ └── route.ts
│ │ └── payments/
│ │ └── route.ts
│ ├── globals.css
│ ├── layout.tsx
│ └── page.tsx
├── domains/ # Domain Layer
│ ├── auth/
│ │ ├── entities/
│ │ │ └── User.ts
│ │ ├── repositories/
│ │ │ └── AuthRepository.ts
│ │ └── services/
│ │ └── AuthService.ts
│ ├── requests/
│ │ ├── entities/
│ │ │ ├── Request.ts
│ │ │ ├── PhotoEditRequest.ts
│ │ │ ├── VideoEditRequest.ts
│ │ │ ├── TextRequest.ts
│ │ │ └── PDFRequest.ts
│ │ ├── repositories/
│ │ │ └── RequestRepository.ts
│ │ └── services/
│ │ └── RequestService.ts
│ ├── photos/
│ │ ├── entities/
│ │ │ └── Photo.ts
│ │ ├── repositories/
│ │ │ └── PhotoRepository.ts
│ │ └── services/
│ │ └── PhotoService.ts
│ ├── chat/
│ │ ├── entities/
│ │ │ ├── Message.ts
│ │ │ └── Chat.ts
│ │ ├── repositories/
│ │ │ └── ChatRepository.ts
│ │ └── services/
│ │ └── ChatService.ts
│ ├── gifts/
│ │ ├── entities/
│ │ │ └── Gift.ts
│ │ ├── repositories/
│ │ │ └── GiftRepository.ts
│ │ └── services/
│ │ └── GiftService.ts
│ └── payments/
│ ├── entities/
│ │ └── Payment.ts
│ ├── repositories/
│ │ └── PaymentRepository.ts
│ └── services/
│ └── PaymentService.ts
├── infrastructure/ # Infrastructure Layer
│ ├── api/
│ │ ├── client.ts
│ │ ├── endpoints.ts
│ │ └── types.ts
│ ├── auth/
│ │ └── jwt.ts
│ ├── storage/
│ │ └── s3.ts
│ └── stripe/
│ └── client.ts
├── shared/ # Shared Layer
│ ├── components/
│ │ ├── ui/
│ │ │ ├── Button.tsx
│ │ │ ├── Input.tsx
│ │ │ ├── Modal.tsx
│ │ │ ├── Card.tsx
│ │ │ ├── Loading.tsx
│ │ │ └── Sidebar.tsx
│ │ ├── forms/
│ │ │ ├── PhotoEditForm.tsx
│ │ │ ├── VideoEditForm.tsx
│ │ │ ├── TextRequestForm.tsx
│ │ │ └── PDFRequestForm.tsx
│ │ ├── layout/
│ │ │ ├── Header.tsx
│ │ │ ├── Navigation.tsx
│ │ │ └── Layout.tsx
│ │ └── features/
│ │ ├── PhotoGallery.tsx
│ │ ├── ChatWindow.tsx
│ │ ├── RequestList.tsx
│ │ └── GiftCatalog.tsx
│ ├── hooks/
│ │ ├── useAuth.ts
│ │ ├── useRequests.ts
│ │ ├── usePhotos.ts
│ │ ├── useChat.ts
│ │ └── usePayments.ts
│ ├── types/
│ │ ├── auth.ts
│ │ ├── requests.ts
│ │ ├── photos.ts
│ │ ├── chat.ts
│ │ └── payments.ts
│ ├── utils/
│ │ ├── validation.ts
│ │ ├── constants.ts
│ │ ├── helpers.ts
│ │ └── formatters.ts
│ └── providers/
│ ├── QueryProvider.tsx
│ ├── AuthProvider.tsx
│ ├── StripeProvider.tsx
│ └── SocketProvider.tsx
├── tailwind.config.ts
├── postcss.config.js
├── next.config.js
└── tsconfig.json

```

```
