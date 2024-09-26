import zod from "zod";

const envSchema = zod.object({
  NEXT_PUBLIC_FIREBASE_API: zod.string(),
  NEXT_PUBLIC_AUTH_DOMAIN: zod.string(),
  NEXT_PUBLIC_PROJECT_ID: zod.string(),
  NEXT_PUBLIC_STORAGE_BUCKET: zod.string(),
  NEXT_PUBLIC_MESSAGING_SENDER_ID: zod.string(),
  NEXT_PUBLIC_APP_ID: zod.string(),
  NEXT_PUBLIC_MEASUREMENT_ID: zod.string(),
  NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL: zod.string(),
  NEXT_PUBLIC_FIREBASE_PRIVATE_KEY: zod.string(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "Invalid environment variables",
    parsedEnv.error.flatten().fieldErrors
  );
  throw new Error("Variáveis de ambiente inválidas");
}

export const env = parsedEnv.data;
