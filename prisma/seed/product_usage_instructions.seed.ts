import { PrismaClient } from '@prisma/client';

const routineInstructions = {
  'Makeup Remover': {
    title: 'Makeup Remover',
    subSteps: [
      {
        title: 'Apply makeup remover to cotton',
        how_to:
          'Prepare a clean cotton pad. Pour enough makeup remover to fully moisten the pad. Ensure the cotton is damp but not dripping. Hold the pad gently before applying to the skin.',
        image_url:
          'https://res.cloudinary.com/dmw3x9yre/image/upload/v1772712179/Apply-makeup_jwpsws.png',
      },
      {
        title: 'Gently wipe the eye & lip area',
        how_to:
          'Place the cotton pad over the eye or lip area and hold it for 5-10 seconds to dissolve makeup. Gently wipe from the inner corner outward. Avoid rubbing too hard to protect delicate skin.',
        image_url:
          'https://res.cloudinary.com/dmw3x9yre/image/upload/v1772712533/Genly-wipe-the-eyes_laphxe.png',
      },
      {
        title: 'Clean the entire face',
        how_to:
          'Take a new cotton pad with makeup remover and gently wipe across cheeks, forehead, nose and chin. Repeat until the cotton pad appears clean and ensure no makeup residue remains.',
        image_url:
          'https://res.cloudinary.com/dmw3x9yre/image/upload/v1772712179/Clean-the-face_kmtigf.png',
      },
    ],
  },

  Cleanser: {
    title: 'Cleanser',
    subSteps: [
      {
        title: 'Wet your face with water',
        how_to:
          'Use cool or lukewarm water to splash gently across your face. Ensure the forehead, cheeks, nose and chin are fully wet. Avoid hot water to prevent dryness.',
        image_url:
          'https://res.cloudinary.com/dmw3x9yre/image/upload/v1772712177/Wet-the-face_gzw3i8.png',
      },
      {
        title: 'Wash your face with cleanser',
        how_to:
          'Take a small amount of cleanser into your palm and add water to create foam. Massage gently in circular motions across the face, focusing on oily areas like the T-zone for about 30-60 seconds.',
        image_url:
          'https://res.cloudinary.com/dmw3x9yre/image/upload/v1772712177/Wash-the-face-with-cleanser_wrskj6.png',
      },
      {
        title: 'Rinse your face with water again',
        how_to:
          'Use cool or lukewarm water to rinse your face until all foam disappears. Check carefully around the nose and hairline to ensure no cleanser residue remains.',
        image_url:
          'https://res.cloudinary.com/dmw3x9yre/image/upload/v1772712180/Rinse-the-face_v4ig1s.png',
      },
      {
        title: 'Dry your face',
        how_to:
          'Use a clean and soft towel to gently pat your skin dry instead of rubbing. Start from the forehead and move downward, leaving the skin slightly damp.',
        image_url:
          'https://res.cloudinary.com/dmw3x9yre/image/upload/v1772712178/Dry-the-face_orroyo.png',
      },
    ],
  },

  Toner: {
    title: 'Toner',
    subSteps: [
      {
        title: 'Dispense an appropriate amount of toner',
        how_to:
          'Pour about 3-5 drops of toner into your palm or onto a cotton pad. Avoid using too much product and prepare to apply evenly across the face.',
        image_url:
          'https://res.cloudinary.com/dmw3x9yre/image/upload/v1772712181/Dispense_ar63n2.png',
      },
      {
        title: 'Apply toner evenly',
        how_to:
          'Gently pat the toner onto your face starting from the center and moving outward. Cover cheeks, forehead and chin evenly while avoiding rubbing too strongly.',
        image_url:
          'https://res.cloudinary.com/dmw3x9yre/image/upload/v1772712180/Apply-toner_xbca29.png',
      },
      {
        title: 'Wait for skin to absorb',
        how_to:
          'Allow the toner to absorb naturally into the skin. Wait about 10-20 seconds before continuing with the next skincare step.',
        image_url:
          'https://res.cloudinary.com/dmw3x9yre/image/upload/v1772712177/Wait-for-skin-to-absorb_pufoft.png',
      },
    ],
  },

  Serum: {
    title: 'Serum',
    subSteps: [
      {
        title: 'Take an appropriate amount of serum',
        how_to:
          'Drop about 2-3 drops of serum onto your palm. Warm the serum slightly between your fingers and avoid using excessive product.',
        image_url:
          'https://res.cloudinary.com/dmw3x9yre/image/upload/v1772712177/Take-serum_trxc1x.png',
      },
      {
        title: 'Apply serum onto clean skin',
        how_to:
          'Dot the serum onto the forehead, cheeks and chin while the skin is slightly damp. Spread evenly across the face and avoid the eye area unless the product is designed for it.',
        image_url:
          'https://res.cloudinary.com/dmw3x9yre/image/upload/v1772712177/Apply-serum_omcwbv.png',
      },
      {
        title: 'Gently pat for absorption',
        how_to:
          'Use your fingertips to gently pat the serum into the skin to help it penetrate more deeply. Continue for about 10 seconds and wait 30-60 seconds before applying the next step.',
        image_url:
          'https://res.cloudinary.com/dmw3x9yre/image/upload/v1772712179/Gently-pat_hikapl.png',
      },
    ],
  },

  Moisturizer: {
    title: 'Moisturizer',
    subSteps: [
      {
        title: 'Take an appropriate amount of moisturizer',
        how_to:
          'Use a pea-sized amount of moisturizer and add more if your skin feels very dry. Warm the cream slightly between your fingertips before applying.',
        image_url:
          'https://res.cloudinary.com/dmw3x9yre/image/upload/v1772712180/Take-an-moisturizer_ey3rib.png',
      },
      {
        title: 'Dot moisturizer evenly on face',
        how_to:
          'Dot the moisturizer onto the forehead, cheeks, nose and chin to distribute the product evenly before spreading it across the skin.',
        image_url:
          'https://res.cloudinary.com/dmw3x9yre/image/upload/v1772712176/Dot-moisturizer_tyo41r.png',
      },
      {
        title: 'Apply a gentle moisturizer',
        how_to:
          'Spread the cream gently across the face using upward and outward motions. Massage softly into the skin without pulling it downward.',
        image_url:
          'https://res.cloudinary.com/dmw3x9yre/image/upload/v1772712179/Apply-moisturizer_w7iyyb.png',
      },
      {
        title: 'Apply to lock moisture',
        how_to:
          'Press both palms gently onto the face and hold for about 5-10 seconds. This helps the moisturizer absorb better and lock hydration into the skin.',
        image_url:
          'https://res.cloudinary.com/dmw3x9yre/image/upload/v1772712179/Apply-to-lock-moisture_pcrc1a.png',
      },
    ],
  },

  Sunscreen: {
    title: 'Sunscreen',
    subSteps: [
      {
        title: 'Take a sufficient amount of sunscreen',
        how_to:
          'Use about two-finger lengths of sunscreen to cover the entire face and neck. Ensure the amount is sufficient for effective protection.',
        image_url:
          'https://res.cloudinary.com/dmw3x9yre/image/upload/v1772713057/Take-sunscreen_zbormk.png',
      },
      {
        title: 'Distribute sunscreen evenly on the skin',
        how_to:
          'Dot sunscreen onto the forehead, cheeks, nose, chin and neck. This helps distribute the product evenly before blending.',
        image_url:
          'https://res.cloudinary.com/dmw3x9yre/image/upload/v1772712180/Distribute-sunscreen_nsdrsr.png',
      },
      {
        title: 'Blend thoroughly and cover evenly with sunscreen',
        how_to:
          'Spread the sunscreen gently across the face and blend carefully around the nose and hairline to ensure no areas are missed.',
        image_url:
          'https://res.cloudinary.com/dmw3x9yre/image/upload/v1772713149/Blend_jvaeoj.png',
      },
      {
        title: 'Reapply sunscreen to maintain effectiveness',
        how_to:
          'Reapply sunscreen every 2-3 hours, especially after sweating or swimming, to maintain proper sun protection throughout the day.',
        image_url:
          'https://res.cloudinary.com/dmw3x9yre/image/upload/v1772712179/Reapply-sunscreen_qxdnei.png',
      },
    ],
  },
};

export async function seedRoutineInstructions(prisma: PrismaClient) {
  for (const [role, data] of Object.entries(routineInstructions)) {
    await prisma.product_usage_instructions.upsert({
      where: { usage_role: role },
      update: {
        title: data.title,
        sub_steps: {
          deleteMany: {},
          create: data.subSteps.map((step, index) => ({
            step_order: index + 1,
            title: step.title,
            how_to: step.how_to,
            image_url: step.image_url,
          })),
        },
      },
      create: {
        usage_role: role,
        title: data.title,
        sub_steps: {
          create: data.subSteps.map((step, index) => ({
            step_order: index + 1,
            title: step.title,
            how_to: step.how_to,
            image_url: step.image_url,
          })),
        },
      },
    });
  }
}
