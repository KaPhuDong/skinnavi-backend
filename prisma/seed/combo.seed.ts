import { PrismaClient, skin_type_enum } from '@prisma/client';

export async function seedProductCombos(prisma: PrismaClient) {
  const skinTypesFromDb = await prisma.skin_types.findMany();
  const skinTypeMap = new Map(skinTypesFromDb.map((st) => [st.code, st.id]));

  const getSkinTypeId = (typeStr: string): string => {
    const normalized = typeStr.toUpperCase().trim();
    let code: skin_type_enum;

    if (normalized.includes('NORMAL')) code = skin_type_enum.NORMAL;
    else if (normalized.includes('DRY')) code = skin_type_enum.DRY;
    else if (normalized.includes('COMBINATION'))
      code = skin_type_enum.COMBINATION;
    else if (normalized.includes('SENSITIVE')) code = skin_type_enum.SENSITIVE;
    else if (normalized.includes('OILY')) code = skin_type_enum.OILY;
    else code = skin_type_enum.NORMAL;

    const id = skinTypeMap.get(code);
    if (!id)
      throw new Error(
        `Not found ID for skin type: ${code} in DB. Please seed skin_types first.`,
      );
    return id;
  };

  const data = [
    {
      skinType: 'Normal',
      comboName: 'SIMPLE 3-Step Skincare Combo',
      comboPrice: 230400,
      comboUrl: 'https://vn.shp.ee/WFYXhET',
      comboImg:
        'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m4ydah1vwqxj8a.webp',
      products: [
        {
          name: 'Simple Facial Cleanser',
          role: 'Cleanser',
          price: 120000,
          url: 'https://shopee.vn/Simple-Facial-Cleanser-150ml',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
        {
          name: 'Centella Micellar Cleansing Water',
          role: 'Cleanser',
          price: 140000,
          url: 'https://shopee.vn/Centella-Micellar-Water',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m4ydah1vwqxj8a.webp',
        },
        {
          name: 'Cocoon Winter Melon Toner',
          role: 'Toner',
          price: 185000,
          url: 'https://shopee.vn/Cocoon-Toner-140ml',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
        {
          name: 'Sunplay Skin Aqua Tone Up UV',
          role: 'Sunscreen',
          price: 175000,
          url: 'https://shopee.vn/Skin-Aqua-Sunscreen',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
      ],
    },
    {
      skinType: 'Normal',
      comboName: 'LA ROCHE-POSAY Basic Combo',
      comboPrice: 550000,
      comboUrl: 'https://vn.shp.ee/LRPNormal',
      comboImg:
        'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
      products: [
        {
          name: 'LRP Effaclar Gel Cleanser',
          role: 'Cleanser',
          price: 385000,
          url: 'https://shopee.vn/LRP-Gel-Cleanser',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
        {
          name: 'LRP Micellar Water Sensitive',
          role: 'Cleanser',
          price: 345000,
          url: 'https://shopee.vn/LRP-Micellar',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
        {
          name: 'LRP Anthelios UVmune 400',
          role: 'Sunscreen',
          price: 450000,
          url: 'https://shopee.vn/LRP-Anthelios',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
      ],
    },
    {
      skinType: 'Dry',
      comboName: 'Hada Labo Hydrating Set',
      comboPrice: 450000,
      comboUrl: 'https://vn.shp.ee/HadaLaboDry',
      comboImg:
        'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
      products: [
        {
          name: 'Hada Labo Gokujyun Cleanser',
          role: 'Cleanser',
          price: 150000,
          url: 'https://shopee.vn/HadaLabo-Cleanser',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
        {
          name: 'Hada Labo Gokujyun Lotion',
          role: 'Toner',
          price: 220000,
          url: 'https://shopee.vn/HadaLabo-Lotion',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
        {
          name: 'Hada Labo Hydrating Cream',
          role: 'Moisturizer',
          price: 280000,
          url: 'https://shopee.vn/HadaLabo-Cream',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
        {
          name: 'Senka Perfect UV Essence',
          role: 'Sunscreen',
          price: 190000,
          url: 'https://shopee.vn/Senka-UV',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
      ],
    },
    {
      skinType: 'Dry',
      comboName: 'Klairs Supple Preparation Set',
      comboPrice: 620000,
      comboUrl: 'https://vn.shp.ee/KlairsSet',
      comboImg:
        'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
      products: [
        {
          name: 'Klairs Gentle Black Cleansing Oil',
          role: 'Cleanser',
          price: 320000,
          url: 'https://shopee.vn/Klairs-Oil',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
        {
          name: 'Klairs Supple Preparation Toner',
          role: 'Toner',
          price: 350000,
          url: 'https://shopee.vn/Klairs-Toner',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
        {
          name: 'Klairs Rich Moist Soothing Cream',
          role: 'Moisturizer',
          price: 390000,
          url: 'https://shopee.vn/Klairs-Cream',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
        {
          name: 'Klairs All-day Airy Sunscreen',
          role: 'Sunscreen',
          price: 380000,
          url: 'https://shopee.vn/Klairs-Sunscreen',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
      ],
    },
    {
      skinType: 'Combination',
      comboName: "Paula's Choice Balancing Set",
      comboPrice: 1250000,
      comboUrl: 'https://vn.shp.ee/PaulasChoice',
      comboImg:
        'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
      products: [
        {
          name: 'PC Skin Balancing Cleanser',
          role: 'Cleanser',
          price: 580000,
          url: 'https://shopee.vn/PC-Cleanser',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
        {
          name: 'PC Skin Balancing Toner',
          role: 'Toner',
          price: 650000,
          url: 'https://shopee.vn/PC-Toner',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
        {
          name: 'PC 2% BHA Liquid Exfoliant',
          role: 'Treatment',
          price: 850000,
          url: 'https://shopee.vn/PC-BHA',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
        {
          name: 'PC Resist Youth-Extended Fluid',
          role: 'Sunscreen',
          price: 920000,
          url: 'https://shopee.vn/PC-Sunscreen',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
      ],
    },
    {
      skinType: 'Combination',
      comboName: 'Skin1004 Madagascar Centella Set',
      comboPrice: 780000,
      comboUrl: 'https://vn.shp.ee/Skin1004Set',
      comboImg:
        'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
      products: [
        {
          name: 'Skin1004 Centella Light Cleansing Oil',
          role: 'Cleanser',
          price: 350000,
          url: 'https://shopee.vn/Skin1004-Oil',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
        {
          name: 'Skin1004 Centella Ampoule Foam',
          role: 'Cleanser',
          price: 280000,
          url: 'https://shopee.vn/Skin1004-Foam',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
        {
          name: 'Skin1004 Centella Ampoule',
          role: 'Serum',
          price: 380000,
          url: 'https://shopee.vn/Skin1004-Ampoule',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
        {
          name: 'Skin1004 Centella Air-Fit Sunscreen',
          role: 'Sunscreen',
          price: 320000,
          url: 'https://shopee.vn/Skin1004-Sunscreen',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
      ],
    },
    {
      skinType: 'Sensitive',
      comboName: 'Curel Intensive Moisture Care',
      comboPrice: 850000,
      comboUrl: 'https://vn.shp.ee/CurelSensitive',
      comboImg:
        'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
      products: [
        {
          name: 'Curel Foaming Facial Wash',
          role: 'Cleanser',
          price: 320000,
          url: 'https://shopee.vn/Curel-Wash',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
        {
          name: 'Curel Moisture Facial Lotion II',
          role: 'Toner',
          price: 450000,
          url: 'https://shopee.vn/Curel-Lotion',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
        {
          name: 'Curel Intensive Moisture Cream',
          role: 'Moisturizer',
          price: 580000,
          url: 'https://shopee.vn/Curel-Cream',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
      ],
    },
    {
      skinType: 'Sensitive',
      comboName: 'Bioderma Sensibio Routine',
      comboPrice: 920000,
      comboUrl: 'https://vn.shp.ee/BiodermaSensitive',
      comboImg:
        'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
      products: [
        {
          name: 'Bioderma Sensibio H2O',
          role: 'Cleanser',
          price: 420000,
          url: 'https://shopee.vn/Bioderma-H2O',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
        {
          name: 'Bioderma Sensibio Gel Moussant',
          role: 'Cleanser',
          price: 380000,
          url: 'https://shopee.vn/Bioderma-Gel',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
        {
          name: 'Bioderma Sensibio Defensive',
          role: 'Moisturizer',
          price: 490000,
          url: 'https://shopee.vn/Bioderma-Defensive',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
        {
          name: 'Bioderma Photoderm Aquafluide',
          role: 'Sunscreen',
          price: 450000,
          url: 'https://shopee.vn/Bioderma-Sunscreen',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
      ],
    },
    {
      skinType: 'Oily',
      comboName: 'SVR Sebiaclear Deep Cleansing Set',
      comboPrice: 680000,
      comboUrl: 'https://vn.shp.ee/SVROily',
      comboImg:
        'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
      products: [
        {
          name: 'SVR Sebiaclear Gel Moussant',
          role: 'Cleanser',
          price: 350000,
          url: 'https://shopee.vn/SVR-Gel',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
        {
          name: 'SVR Sebiaclear Micro-Peel',
          role: 'Toner',
          price: 390000,
          url: 'https://shopee.vn/SVR-Toner',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
        {
          name: 'SVR Sebiaclear Mat + Pores',
          role: 'Moisturizer',
          price: 420000,
          url: 'https://shopee.vn/SVR-Mat',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
        {
          name: 'Vichy Ideal Soleil Dry Touch',
          role: 'Sunscreen',
          price: 480000,
          url: 'https://shopee.vn/Vichy-Sunscreen',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
      ],
    },
    {
      skinType: 'Oily',
      comboName: 'LRP Effaclar Acne Set',
      comboPrice: 750000,
      comboUrl: 'https://vn.shp.ee/LRPOily',
      comboImg:
        'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
      products: [
        {
          name: 'LRP Effaclar Foaming Gel',
          role: 'Cleanser',
          price: 385000,
          url: 'https://shopee.vn/LRP-Oily-Gel',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
        {
          name: 'LRP Effaclar Clarifying Lotion',
          role: 'Toner',
          price: 420000,
          url: 'https://shopee.vn/LRP-Lotion',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
        {
          name: 'LRP Effaclar Duo+',
          role: 'Treatment',
          price: 450000,
          url: 'https://shopee.vn/LRP-Duo',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
        {
          name: 'LRP Anthelios Oil Control',
          role: 'Sunscreen',
          price: 480000,
          url: 'https://shopee.vn/LRP-Oil-Control',
          img: 'https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1h1aoscu82baa.webp',
        },
      ],
    },
  ];

  for (const comboData of data) {
    const productIds: string[] = [];

    // Create or update products
    for (const p of comboData.products) {
      const existing = await prisma.affiliate_products.findFirst({
        where: { name: p.name },
      });

      let product;

      if (existing) {
        product = await prisma.affiliate_products.update({
          where: { id: existing.id },
          data: {
            display_price: p.price,
            affiliate_url: p.url,
            image_url: p.img,
            usage_role: p.role,
          },
        });
      } else {
        product = await prisma.affiliate_products.create({
          data: {
            name: p.name,
            usage_role: p.role,
            display_price: p.price,
            affiliate_url: p.url,
            image_url: p.img,
          },
        });
      }

      productIds.push(product.id);
    }

    // Create combo with linked products
    await prisma.skincare_combos.create({
      data: {
        skin_type_id: getSkinTypeId(comboData.skinType),
        combo_name: comboData.comboName,
        display_price: comboData.comboPrice,
        affiliate_url: comboData.comboUrl,
        image_url: comboData.comboImg,
        combo_products: {
          create: productIds.map((pid, index) => ({
            product_id: pid,
            step_order: index + 1,
          })),
        },
      },
    });
  }
}
