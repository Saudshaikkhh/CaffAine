import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) { }

  @Post('mood')
  analyzeMood(@Body() body: { mood: string }) {
    return this.aiService.analyzeMood(body.mood || '');
  }

  @Get('recommend')
  recommend(@Query('mood') mood: string) {
    return this.aiService.recommend(mood || '');
  }

  @Post('upsell')
  upsell(@Body() body: { items: any[] }) {
    return this.aiService.upsell(body.items || []);
  }

  @Post('nlp')
  nlpOrder(@Body() body: { text: string }) {
    return this.aiService.nlpOrder(body.text || '');
  }
}
