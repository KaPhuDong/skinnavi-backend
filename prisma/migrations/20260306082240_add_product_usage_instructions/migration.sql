-- CreateTable
CREATE TABLE "product_usage_instructions" (
    "id" TEXT NOT NULL,
    "usage_role" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_usage_instructions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_usage_sub_steps" (
    "id" TEXT NOT NULL,
    "instruction_id" TEXT NOT NULL,
    "step_order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "how_to" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "product_usage_sub_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_routine_sub_steps" (
    "id" UUID NOT NULL,
    "user_routine_step_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "how_to" TEXT,
    "image_url" TEXT,

    CONSTRAINT "user_routine_sub_steps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_usage_instructions_usage_role_key" ON "product_usage_instructions"("usage_role");

-- AddForeignKey
ALTER TABLE "product_usage_sub_steps" ADD CONSTRAINT "product_usage_sub_steps_instruction_id_fkey" FOREIGN KEY ("instruction_id") REFERENCES "product_usage_instructions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_routine_sub_steps" ADD CONSTRAINT "user_routine_sub_steps_user_routine_step_id_fkey" FOREIGN KEY ("user_routine_step_id") REFERENCES "user_routine_steps"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
