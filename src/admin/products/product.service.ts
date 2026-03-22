import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getProducts(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.affiliate_products.findMany({
        skip,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      this.prisma.affiliate_products.count(),
    ]);

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      items,
    };
  }

  async getProductDetail(id: string) {
    const product = await this.prisma.affiliate_products.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async createProduct(data: {
    name: string;
    display_price?: number;
    affiliate_url: string;
    image_url?: string;
  }) {
    return this.prisma.affiliate_products.create({
      data,
    });
  }

  async updateProduct(
    id: string,
    data: {
      product_name?: string;
      display_price?: number;
      affiliate_url?: string;
      image_url?: string;
      usage_role?: string;
    },
  ) {
    const existing = await this.prisma.affiliate_products.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Product not found');
    }

    return this.prisma.affiliate_products.update({
      where: { id },
      data,
    });
  }

  async deleteProduct(id: string) {
    const existing = await this.prisma.affiliate_products.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.combo_products.deleteMany({
      where: { product_id: id },
    });

    return this.prisma.affiliate_products.delete({
      where: { id },
    });
  }
}
