CREATE TABLE IF NOT EXISTS "account" (
	"userId" varchar(35) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"providerAccountId" varchar(35) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "answers" (
	"id" varchar(35) PRIMARY KEY NOT NULL,
	"answer" varchar(255) NOT NULL,
	"is_right" boolean DEFAULT FALSE NOT NULL,
	"user_id" varchar(35) NOT NULL,
	"round_id" varchar(35) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rounds" (
	"id" varchar(35) PRIMARY KEY NOT NULL,
	"route_id" varchar(35) NOT NULL,
	"clue" varchar(255) NOT NULL,
	"next_teacher_clue" varchar(255) NOT NULL,
	"clue_answer" varchar(255) NOT NULL,
	"next_teacher_answer" varchar(255) NOT NULL,
	"key_segment" varchar(255) NOT NULL,
	"sequence" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "routes" (
	"id" varchar(35) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(35) NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" varchar(35) PRIMARY KEY NOT NULL,
	"route_id" varchar(35) NOT NULL,
	"name" varchar(255) NOT NULL,
	"image" varchar(255),
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp (3) DEFAULT CURRENT_TIMESTAMP(3)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verificationToken" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "acc_userId_idx" ON "account" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sesh_userId_idx" ON "session" USING btree ("userId");