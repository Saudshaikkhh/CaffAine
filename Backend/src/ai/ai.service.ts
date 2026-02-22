import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) { }

  async analyzeMood(text: string) {
    const moods = [
      {
        mood: 'Happy',
        keywords: ['happy', 'great', 'good', 'excited', 'love', 'amazing', 'perfect', 'wonderful'],
        recommendation: 'Cappuccino',
        treatment: "It's truly wonderful to see you in such high spirits!",
        intros: [
          "That's absolutely fantastic! Your energy is such a gift.",
          "I'm smiling just hearing that. What a beautiful way to feel.",
          "It's moments like these that make my day. I love this for you!"
        ],
        reason: 'A velvety, light Cappuccino is the perfect dance partner for your current joy.'
      },
      {
        mood: 'Sad',
        keywords: ['low', 'sad', 'unhappy', 'blue', 'depressed', 'gloomy', 'crying', 'bad day'],
        recommendation: 'Mocha',
        treatment: "I am so, so sorry you're feeling low right now. Please know that it's okay to not be okay.",
        intros: [
          "Sending you a warm virtual hug. I'm right here with you.",
          "I wish I could offer you a real hand to hold, but for now, let me offer you my most comforting brew.",
          "It sounds like your heart is a bit heavy today. Let's take it slow, one sip at a time."
        ],
        reason: 'Something rich, chocolatey, and warm like a Mocha can be very grounding and comforting when things feel difficult.'
      },
      {
        mood: 'Tired',
        keywords: ['tired', 'exhausted', 'sleepy', 'drained', 'long day', 'need coffee', 'wake up'],
        recommendation: 'Double Espresso',
        treatment: "I can tell you've been giving your all today, and that's truly admirable.",
        intros: [
          "It sounds like you've been working so hard. Please, let yourself take a moment to just be.",
          "I can sense the fatigue, but also the perseverance. You're doing great.",
          "A long day calls for a little extra care. I'm here to help you find your spark again."
        ],
        reason: 'A Double Espresso is my most dedicated way to help you recharge and find that second wind.'
      },
      {
        mood: 'Stressed',
        keywords: ['stressed', 'busy', 'deadline', 'work', 'anxious', 'worried', 'pressure', 'overwhelmed'],
        recommendation: 'Latte',
        treatment: "I'm so sorry things are feeling heavy and overwhelming right now.",
        intros: [
          "Take a deep breath with me. Right now. One... two... three.",
          "I'm here to provide a little pocket of calm in your busy world.",
          "Let's find a way to quiet the noise together. You're not alone in this."
        ],
        reason: 'The warm, gentle texture of a Latte is designed to soothe and help you find a moment of peace.'
      },
      {
        mood: 'Chill',
        keywords: ['chill', 'relax', 'cool', 'calm', 'vibe', 'peaceful'],
        recommendation: 'Iced Americano',
        treatment: "It's so peaceful to see you in such a balanced state of mind.",
        intros: [
          "It sounds like you've found your rhythm. That's a beautiful place to be.",
          "Perfect. Let's match that cool, relaxed energy with something refreshing.",
          "I love this vibe you're bringing. It feels very grounded and serene."
        ],
        reason: 'An Iced Americano is crisp and clear—just like the peace you\'re feeling right now.'
      },
    ];

    const lowerText = text.toLowerCase();
    const detected = moods.find(m => m.keywords.some(k => lowerText.includes(k)));

    const productName = detected ? detected.recommendation : 'House Blend Coffee';
    const reason = detected ? detected.reason : 'A classic, reliable choice to accompany you through whatever the day brings.';
    const moodName = detected ? detected.mood : 'Neutral';
    const treatment = detected ? detected.treatment : "I'm so grateful you shared that with me.";

    const intros = detected ? detected.intros : [
      "I'm here to listen and help you find the perfect brew for your moment.",
      "Thank you for being open with me. I'm here to make your day a little brighter.",
      "Every mood is a journey. I'd be honored to accompany you on yours."
    ];

    const intro = intros[Math.floor(Math.random() * intros.length)];

    let product = await this.prisma.product.findFirst({
      where: {
        name: {
          contains: productName,
        },
      },
    });

    // Fallback if the specific product isn't found
    if (!product) {
      product = await this.prisma.product.findFirst({
        where: { name: { contains: 'Coffee' } }
      }) || await this.prisma.product.findFirst();
    }

    const baristaMessage = `${intro} ${treatment} Based on what you've told me, I've specially selected our ${product?.name} just for you. ${reason}`;

    return {
      mood: moodName,
      product: product,
      message: baristaMessage,
    };
  }

  async recommend(mood: string) {
    // Direct mood selection
    return this.analyzeMood(mood);
  }

  async upsell(orderItems: any[]) {
    // Simple logic: if coffee, suggest pastry
    const hasCoffee = orderItems.some(item => item.name?.toLowerCase().includes('coffee') || item.category === 'HOT' || item.category === 'COLD');

    let suggestionName = 'Bottle of Water';
    let reason = 'Stay hydrated!';

    if (hasCoffee) {
      suggestionName = 'Chocolate Cookie';
      reason = 'Pairs perfectly with your coffee.';
    }

    const product = await this.prisma.product.findFirst({
      where: {
        name: {
          contains: suggestionName,
        },
      },
    });

    return {
      suggestion: suggestionName,
      product: product,
      reason: reason,
    };
  }


  nlpOrder(text: string) {
    // Mock NLP parsing
    const lowerText = text.toLowerCase();

    if (lowerText.includes('strong') && lowerText.includes('hot')) {
      return { product: 'Double Espresso', quantity: 1 };
    }
    if (lowerText.includes('sweet') && lowerText.includes('cold')) {
      return { product: 'Iced Caramel Macchiato', quantity: 1 };
    }
    if (lowerText.includes('latte')) {
      return { product: 'Latte', quantity: 1 };
    }

    return null;
  }
}
