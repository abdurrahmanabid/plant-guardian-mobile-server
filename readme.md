## Plant Guardian Server — API ডকুমেন্টেশন

এই সার্ভারটি Express.js ভিত্তিক এবং ইমেজ আপলোড/প্রেডিকশন, ইউজার ম্যানেজমেন্ট, GPT/AI সার্ভিস এবং মডেল ম্যানেজমেন্ট ফিচার সরবরাহ করে।

### বেস URL
- লোকাল: `http://localhost:3000`
- সব API রাউটের প্রিফিক্স: `/api`

### স্ট্যাটিক ফাইল সার্ভিং
- অ্যাভাটার: `GET /static/avatar/*` → `uploads/avatar/` ডিরেক্টরি থেকে সার্ভ হয়

---

## 1) ইউজার রাউটস (`/api/user`)

| মেথড | রাউট | কাজ |
| --- | --- | --- |
| POST | `/api/user/signup` | ইউজার রেজিস্ট্রেশন |
| POST | `/api/user/signin` | ইউজার লগইন |
| POST | `/api/user/upload-avatar` | ইউজার অ্যাভাটার আপলোড (JPEG/PNG) |
| GET | `/api/user/get-user` | ইউজার ইনফো (অথেনটিকেশন প্রয়োজন হতে পারে) |
| GET | `/api/user/signout` | ইউজার সাইনআউট |

---

## 2) প্রেডিকশন রাউটস (`/api/predict`)

| মেথড | রাউট | কাজ |
| --- | --- | --- |
| POST | `/api/predict/leaf-upload` | লিফ ইমেজ আপলোড (JPEG/PNG) → `uploads/leaf/` |
| POST | `/api/predict/image-predict` | আপলোড করা ইমেজ থেকে ডিজিজ প্রেডিকশন |
| POST | `/api/predict/predict-fertilizer` | ফার্টিলাইজার প্রেডিকশন |
| POST | `/api/predict/predict-fertilizer-and-treatment` | ফার্টিলাইজার + ট্রিটমেন্ট প্রেডিকশন |
| DELETE | `/api/predict/delete-image` | সার্ভার থেকে ইমেজ ডিলিট (বডি: `{ imageUrl: "uploads/leaf/.." }`) |

উদাহরণ (ইমেজ ডিলিট):
```bash
curl -X DELETE http://localhost:3000/api/predict/delete-image \
  -H "Content-Type: application/json" \
  -d '{"imageUrl":"uploads/leaf/1757925565623-bacterial_val (80).JPG"}'
```

> নোট: নিরাপত্তার জন্য কেবলমাত্র `uploads/` ডিরেক্টরির ভিতরের ফাইল ডিলিট করা যায়।

---

## 3) মডেল ম্যানেজমেন্ট রাউটস (`/api/model`)

| মেথড | রাউট | কাজ |
| --- | --- | --- |
| POST | `/api/model/image` | নতুন ইমেজ রেকর্ড তৈরি |
| GET | `/api/model/image` | ইউজারের ইমেজ লিস্ট |
| GET | `/api/model/image/recent` | রিসেন্ট ইমেজ |
| GET | `/api/model/image/disease/:diseaseName` | নির্দিষ্ট ডিজিজ অনুযায়ী ইমেজ |
| GET | `/api/model/image/:id` | নির্দিষ্ট ইমেজ রেকর্ড |
| PUT | `/api/model/image/:id` | ইমেজ রেকর্ড আপডেট |
| DELETE | `/api/model/image/:id` | ইমেজ রেকর্ড ডিলিট |

---

## 4) GPT/AI রাউটস (`/api/gpt`)

| মেথড | রাউট | কাজ |
| --- | --- | --- |
| POST | `/api/gpt/gpt-explain` | AI এক্সপ্লেইনেশন |
| POST | `/api/gpt/gpt-conversation` | AI কনভারসেশন |
| GET | `/api/gpt/gpt-health` | GPT সার্ভিস হেলথ চেক |
| GET | `/api/gpt/gpt-test` | GPT সার্ভিস টেস্ট |

---

## দ্রুত সংক্ষিপ্তসার
- ইউজার, প্রেডিকশন, মডেল ম্যানেজমেন্ট ও GPT—এই ৪টি ক্যাটেগরিতে মোট রাউটগুলো সাজানো।
- ফাইল আপলোডের জন্য `uploads/avatar` এবং `uploads/leaf` ব্যবহৃত হয়।
- নতুন যুক্ত রাউট: `DELETE /api/predict/delete-image` — `uploads/` এর ভিতরের ইমেজ নিরাপদে ডিলিট করে।
