import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import SubscriptionBanner from '@/components/SubscriptionBanner';

interface RoomType {
  id: string;
  name: string;
  rooms: number;
  guests: number;
  basePrice: number;
}

interface OccupancyRange {
  id: string;
  label: string;
  multiplier: number;
}

interface Constants {
  breakfastPrice: number;
  seasonMultiplier: number;
  competitorCoeff: number;
}

interface Competitor {
  id: string;
  name: string;
  coefficient: number;
  avgPrice: number;
}

const RevenueManagementPlatform = () => {
  const [activeModel, setActiveModel] = useState<'occupancy' | 'season' | 'competitors'>('occupancy');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Исходные данные
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([
    { id: '1', name: "Стандарт Мини", rooms: 2, guests: 2, basePrice: 30000 },
    { id: '2', name: "Стандарт", rooms: 5, guests: 2, basePrice: 35000 },
    { id: '3', name: "Семейный", rooms: 3, guests: 4, basePrice: 45000 },
    { id: '4', name: "Люкс 3к панорамный", rooms: 1, guests: 6, basePrice: 85000 }
  ]);

  const [occupancyRanges] = useState<OccupancyRange[]>([
    { id: '1', label: "До 20%", multiplier: 1.0 },
    { id: '2', label: "20-40%", multiplier: 1.15 },
    { id: '3', label: "40-60%", multiplier: 1.3 },
    { id: '4', label: "60-80%", multiplier: 1.45 },
    { id: '5', label: "80%+", multiplier: 1.6 }
  ]);

  const [constants, setConstants] = useState<Constants>({
    breakfastPrice: 3500,
    seasonMultiplier: 1.2,
    competitorCoeff: 0.95
  });

  const [competitors] = useState<Competitor[]>([
    { id: '1', name: "Гранд Шале", coefficient: 0.9, avgPrice: 39800 },
    { id: '2', name: "Альпина Резорт", coefficient: 1.1, avgPrice: 45200 },
    { id: '3', name: "Горный Дом", coefficient: 0.88, avgPrice: 38900 },
  ]);

  // Главная формула расчета цен
  const calculatePrice = (roomType: RoomType, occupancyMultiplier: number, model: string): number => {
    const { basePrice, guests } = roomType;
    
    switch (model) {
      case 'occupancy':
        return Math.round((basePrice + (guests * constants.breakfastPrice)) * occupancyMultiplier);
      
      case 'season':
        return Math.round(basePrice * constants.seasonMultiplier * occupancyMultiplier);
      
      case 'competitors':
        return Math.round(basePrice * constants.competitorCoeff * occupancyMultiplier);
      
      default:
        return basePrice;
    }
  };

  // Генерация данных аналитики
  const generateAnalyticsData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const occupancy = Math.floor(Math.random() * 40) + 60;
      const revenue = occupancy * 2000 + Math.random() * 50000;
      
      data.push({
        date: date.toISOString().split('T')[0],
        occupancy,
        revenue: Math.round(revenue),
        adr: Math.round(revenue / (occupancy / 10))
      });
    }
    
    return data;
  };

  const analyticsData = generateAnalyticsData();

  const updateConstant = (key: keyof Constants, value: number) => {
    setConstants(prev => ({ ...prev, [key]: value }));
  };

  const getModelTitle = () => {
    switch (activeModel) {
      case 'occupancy': return 'Цены от загрузки';
      case 'season': return 'Сезонная модель';
      case 'competitors': return 'Модель конкурентов';
      default: return 'Управление ценами';
    }
  };

  const getModelDescription = () => {
    switch (activeModel) {
      case 'occupancy': return 'Динамическое ценообразование на основе текущей загрузки отеля';
      case 'season': return 'Корректировка цен с учетом сезонных коэффициентов';
      case 'competitors': return 'Позиционирование относительно конкурентов';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Баннер подписки */}
      <SubscriptionBanner trialDaysLeft={12} />
      
      {/* Хедер */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Revenue Management Platform</h1>
            <p className="text-gray-600 mt-1">Профессиональное управление доходами отеля</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Icon name="Clock" size={14} className="mr-1" />
              Пробный период: 12 дней
            </Badge>
            
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Icon name="Settings" size={16} className="mr-2" />
                  Настройки
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Настройки констант</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="breakfast">Цена завтрака (₽)</Label>
                    <Input
                      id="breakfast"
                      type="number"
                      value={constants.breakfastPrice}
                      onChange={(e) => updateConstant('breakfastPrice', Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="season">Сезонный коэффициент</Label>
                    <Input
                      id="season"
                      type="number"
                      step="0.1"
                      value={constants.seasonMultiplier}
                      onChange={(e) => updateConstant('seasonMultiplier', Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="competitor">Коэффициент конкурентов</Label>
                    <Input
                      id="competitor"
                      type="number"
                      step="0.01"
                      value={constants.competitorCoeff}
                      onChange={(e) => updateConstant('competitorCoeff', Number(e.target.value))}
                    />
                  </div>
                  <Button 
                    onClick={() => setShowSettings(false)} 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Сохранить настройки
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Фильтры */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label className="text-sm font-medium">Модель:</Label>
            <Select value={activeModel} onValueChange={(value: 'occupancy' | 'season' | 'competitors') => setActiveModel(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="occupancy">От загрузки</SelectItem>
                <SelectItem value="season">Сезонная</SelectItem>
                <SelectItem value="competitors">Конкуренты</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Label className="text-sm font-medium">Период:</Label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Неделя</SelectItem>
                <SelectItem value="month">Месяц</SelectItem>
                <SelectItem value="quarter">Квартал</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs defaultValue="pricing" className="space-y-6">
        <TabsList className="bg-white shadow-sm">
          <TabsTrigger value="pricing" className="flex items-center">
            <Icon name="Calculator" size={16} className="mr-2" />
            Ценообразование
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center">
            <Icon name="BarChart3" size={16} className="mr-2" />
            Аналитика
          </TabsTrigger>
          <TabsTrigger value="competitors" className="flex items-center">
            <Icon name="Target" size={16} className="mr-2" />
            Конкуренты
          </TabsTrigger>
        </TabsList>

        {/* Основная таблица ценообразования */}
        <TabsContent value="pricing" className="space-y-6">
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardTitle className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{getModelTitle()}</h2>
                  <p className="text-blue-100 text-sm mt-1">{getModelDescription()}</p>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  Обновлено: сейчас
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-900 border-r border-gray-200">
                        Категория номера
                      </th>
                      {occupancyRanges.map((range) => (
                        <th key={range.id} className="text-center p-4 font-semibold text-gray-900 border-r border-gray-200 min-w-[120px]">
                          {range.label}
                        </th>
                      ))}
                      <th className="text-center p-4 font-semibold text-gray-900">
                        Доступность
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {roomTypes.map((roomType, rowIndex) => (
                      <tr 
                        key={roomType.id} 
                        className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                      >
                        <td className="p-4 font-semibold text-gray-900 border-r border-gray-200">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span>{roomType.name}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {roomType.guests} гостей • {roomType.rooms} номеров
                          </div>
                        </td>
                        
                        {occupancyRanges.map((range) => {
                          const price = calculatePrice(roomType, range.multiplier, activeModel);
                          const prevPrice = calculatePrice(roomType, range.multiplier * 0.9, activeModel);
                          const isIncreased = price > prevPrice;
                          
                          return (
                            <td 
                              key={range.id} 
                              className="text-center p-4 border-r border-gray-200 relative group cursor-pointer hover:bg-blue-50"
                            >
                              <div className="font-bold text-lg text-gray-900">
                                {price.toLocaleString()} ₽
                              </div>
                              <div className={`text-xs flex items-center justify-center mt-1 ${
                                isIncreased ? 'text-green-600' : 'text-red-600'
                              }`}>
                                <Icon 
                                  name={isIncreased ? "TrendingUp" : "TrendingDown"} 
                                  size={12} 
                                  className="mr-1" 
                                />
                                {Math.abs(((price - prevPrice) / prevPrice) * 100).toFixed(1)}%
                              </div>
                              
                              {/* Tooltip при наведении */}
                              <div className="absolute hidden group-hover:block bg-gray-900 text-white text-xs rounded p-2 bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap z-10">
                                Базовая цена: {roomType.basePrice.toLocaleString()} ₽<br/>
                                Множитель: {range.multiplier}x<br/>
                                {activeModel === 'occupancy' && `+ завтрак: ${(roomType.guests * constants.breakfastPrice).toLocaleString()} ₽`}
                              </div>
                            </td>
                          );
                        })}
                        
                        <td className="text-center p-4">
                          <div className="flex items-center justify-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${
                              roomType.rooms > 3 ? 'bg-green-500' : 
                              roomType.rooms > 1 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></div>
                            <span className="text-sm font-medium">{roomType.rooms} ном.</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Быстрые инсайты */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700">Рекомендация</p>
                    <p className="font-semibold text-green-900 mt-1">
                      +12% к Люксам
                    </p>
                  </div>
                  <Icon name="TrendingUp" size={24} className="text-green-600" />
                </div>
                <p className="text-xs text-green-600 mt-2">
                  Высокий спрос в сегменте премиум
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700">Средний ADR</p>
                    <p className="font-semibold text-blue-900 mt-1">
                      47,300 ₽
                    </p>
                  </div>
                  <Icon name="DollarSign" size={24} className="text-blue-600" />
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  +8% к прошлому месяцу
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-700">Прогноз дохода</p>
                    <p className="font-semibold text-purple-900 mt-1">
                      4.2М ₽
                    </p>
                  </div>
                  <Icon name="Target" size={24} className="text-purple-600" />
                </div>
                <p className="text-xs text-purple-600 mt-2">
                  На следующий месяц
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Аналитика */}
        <TabsContent value="analytics" className="space-y-6">
          {/* Heatmap загрузки */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Icon name="Activity" size={20} className="mr-2 text-blue-600" />
                Heatmap загрузки по категориям
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-600 p-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {roomTypes.map((roomType) => (
                <div key={roomType.id} className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">{roomType.name}</h4>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 14 }, (_, i) => {
                      const occupancy = Math.floor(Math.random() * 100);
                      const intensity = occupancy / 100;
                      return (
                        <div
                          key={i}
                          className="h-8 rounded flex items-center justify-center text-xs font-medium"
                          style={{
                            backgroundColor: `rgba(59, 130, 246, ${intensity})`,
                            color: intensity > 0.5 ? 'white' : 'rgb(59, 130, 246)'
                          }}
                        >
                          {occupancy}%
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              
              <div className="flex items-center justify-between mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Загрузка:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-200 rounded"></div>
                    <span className="text-sm text-gray-600">0-50%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-sm text-gray-600">50-80%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-800 rounded"></div>
                    <span className="text-sm text-gray-600">80%+</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Графики динамики */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="BarChart3" size={20} className="mr-2 text-green-600" />
                  Динамика дохода
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Icon name="TrendingUp" size={48} className="text-green-500 mx-auto mb-4" />
                    <p className="text-green-700 font-semibold">+18% рост</p>
                    <p className="text-green-600 text-sm">за последние 30 дней</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="Users" size={20} className="mr-2 text-purple-600" />
                  Загрузка по дням недели
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { day: 'Понедельник', occupancy: 65, revenue: 280000 },
                    { day: 'Вторник', occupancy: 72, revenue: 320000 },
                    { day: 'Среда', occupancy: 78, revenue: 350000 },
                    { day: 'Четверг', occupancy: 85, revenue: 410000 },
                    { day: 'Пятница', occupancy: 95, revenue: 520000 },
                    { day: 'Суббота', occupancy: 98, revenue: 580000 },
                    { day: 'Воскресенье', occupancy: 88, revenue: 460000 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 w-20">{item.day.slice(0, 3)}</span>
                      <div className="flex-1 mx-4">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-purple-500 h-3 rounded-full" 
                            style={{ width: `${item.occupancy}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-gray-900">{item.occupancy}%</span>
                        <p className="text-xs text-gray-500">{(item.revenue / 1000).toFixed(0)}к ₽</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI-инсайты */}
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
            <CardHeader>
              <CardTitle className="flex items-center text-indigo-900">
                <Icon name="Brain" size={20} className="mr-2" />
                AI-рекомендации
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-indigo-200">
                <div className="flex items-start space-x-3">
                  <Icon name="Lightbulb" size={20} className="text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Оптимизация выходных</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Повысьте цены на Люкс 3к на 15% в пятницу-воскресенье. 
                      Спрос превышает предложение на 23%.
                    </p>
                    <div className="flex items-center mt-2 space-x-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        +47,000 ₽ дохода
                      </Badge>
                      <Button size="sm" variant="outline" className="text-xs">
                        Применить
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-indigo-200">
                <div className="flex items-start space-x-3">
                  <Icon name="Target" size={20} className="text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Конкурентная позиция</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Стандартные номера на 8% дороже конкурентов. 
                      Рекомендуем снижение на 3,000 ₽.
                    </p>
                    <div className="flex items-center mt-2 space-x-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        +12% бронирований
                      </Badge>
                      <Button size="sm" variant="outline" className="text-xs">
                        Подробнее
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-indigo-200">
                <div className="flex items-start space-x-3">
                  <Icon name="Calendar" size={20} className="text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Сезонная корректировка</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Через 2 недели начнется высокий сезон. 
                      Подготовьте повышение цен на 20%.
                    </p>
                    <div className="flex items-center mt-2 space-x-2">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        Запланировать
                      </Badge>
                      <Button size="sm" variant="outline" className="text-xs">
                        В календарь
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Конкуренты */}
        <TabsContent value="competitors" className="space-y-6">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Icon name="Target" size={20} className="mr-2 text-red-600" />
                Анализ конкурентов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competitors.map((competitor) => (
                  <div 
                    key={competitor.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900">{competitor.name}</h3>
                      <p className="text-sm text-gray-600">
                        Коэффициент: {competitor.coefficient}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{competitor.avgPrice.toLocaleString()} ₽</p>
                      <p className="text-sm text-gray-600">Средняя цена</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RevenueManagementPlatform;