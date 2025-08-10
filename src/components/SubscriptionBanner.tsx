import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface SubscriptionBannerProps {
  trialDaysLeft: number;
}

const SubscriptionBanner: React.FC<SubscriptionBannerProps> = ({ trialDaysLeft }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleUpgrade = () => {
    // Здесь будет интеграция со Stripe/CloudPayments
    console.log('Переход к оплате подписки');
  };

  if (trialDaysLeft <= 0) {
    return (
      <Card className="bg-gradient-to-r from-red-500 to-pink-600 text-white mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="AlertCircle" size={24} className="text-red-100" />
              <div>
                <h3 className="font-semibold">Пробный период истёк</h3>
                <p className="text-red-100 text-sm">
                  Активируйте подписку для продолжения работы
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setShowPaymentModal(true)}
              className="bg-white text-red-600 hover:bg-red-50"
            >
              Активировать за 5000 ₽/мес
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-gradient-to-r from-orange-400 to-yellow-500 text-white mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="Clock" size={24} className="text-orange-100" />
              <div>
                <h3 className="font-semibold">
                  Пробный период: {trialDaysLeft} {trialDaysLeft === 1 ? 'день' : 'дня'}
                </h3>
                <p className="text-orange-100 text-sm">
                  Полный доступ ко всем функциям Revenue Management
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-white/20 text-white">
                До {new Date(Date.now() + trialDaysLeft * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU')}
              </Badge>
              <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
                <DialogTrigger asChild>
                  <Button className="bg-white text-orange-600 hover:bg-orange-50">
                    <Icon name="CreditCard" size={16} className="mr-2" />
                    Оформить подписку
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Выберите план подписки</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    {/* Базовый план */}
                    <div className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Базовый план</h3>
                          <p className="text-gray-600 text-sm">Все основные функции</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">5000 ₽</p>
                          <p className="text-gray-500 text-sm">в месяц</p>
                        </div>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-600 mb-4">
                        <li className="flex items-center">
                          <Icon name="Check" size={16} className="text-green-500 mr-2" />
                          Revenue Engine с 3 моделями ценообразования
                        </li>
                        <li className="flex items-center">
                          <Icon name="Check" size={16} className="text-green-500 mr-2" />
                          Интерактивные таблицы и heatmap
                        </li>
                        <li className="flex items-center">
                          <Icon name="Check" size={16} className="text-green-500 mr-2" />
                          Анализ конкурентов
                        </li>
                        <li className="flex items-center">
                          <Icon name="Check" size={16} className="text-green-500 mr-2" />
                          Техподдержка в рабочее время
                        </li>
                      </ul>
                      <Button 
                        onClick={handleUpgrade}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        Выбрать план
                      </Button>
                    </div>

                    {/* Премиум план */}
                    <div className="border-2 border-purple-500 rounded-lg p-4 relative bg-purple-50">
                      <div className="absolute -top-3 left-4">
                        <Badge className="bg-purple-500">Популярный</Badge>
                      </div>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Премиум план</h3>
                          <p className="text-gray-600 text-sm">Продвинутая аналитика + прогнозы</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">7000 ₽</p>
                          <p className="text-gray-500 text-sm">в месяц</p>
                        </div>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-600 mb-4">
                        <li className="flex items-center">
                          <Icon name="Check" size={16} className="text-green-500 mr-2" />
                          Всё из базового плана
                        </li>
                        <li className="flex items-center">
                          <Icon name="Check" size={16} className="text-green-500 mr-2" />
                          AI-прогнозы загрузки на 30 дней
                        </li>
                        <li className="flex items-center">
                          <Icon name="Check" size={16} className="text-green-500 mr-2" />
                          Автоматические рекомендации по ценам
                        </li>
                        <li className="flex items-center">
                          <Icon name="Check" size={16} className="text-green-500 mr-2" />
                          Интеграция с PMS системами
                        </li>
                        <li className="flex items-center">
                          <Icon name="Check" size={16} className="text-green-500 mr-2" />
                          Приоритетная поддержка 24/7
                        </li>
                      </ul>
                      <Button 
                        onClick={handleUpgrade}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        Выбрать план
                      </Button>
                    </div>

                    <div className="text-center pt-4 border-t">
                      <p className="text-sm text-gray-500 mb-2">
                        Безопасная оплата через Stripe • Отмена в любое время
                      </p>
                      <div className="flex justify-center items-center space-x-4 text-xs text-gray-400">
                        <div className="flex items-center">
                          <Icon name="Shield" size={14} className="mr-1" />
                          SSL защита
                        </div>
                        <div className="flex items-center">
                          <Icon name="CreditCard" size={14} className="mr-1" />
                          Visa, MasterCard
                        </div>
                        <div className="flex items-center">
                          <Icon name="RefreshCw" size={14} className="mr-1" />
                          Автопродление
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default SubscriptionBanner;