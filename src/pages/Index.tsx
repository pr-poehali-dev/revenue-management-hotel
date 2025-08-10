import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Index = () => {
  const [activeView, setActiveView] = useState('occupancy');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showSettings, setShowSettings] = useState(false);
  const [constants, setConstants] = useState({
    breakfastPrice: 3500,
    seasonMultiplier: 1.2,
    competitorCoeff: 0.95
  });

  // Данные для расчета цен
  const roomTypes = [
    { name: "Стандарт Мини", rooms: 2, guests: 2, basePrice: 30000 },
    { name: "Стандарт", rooms: 5, guests: 2, basePrice: 35000 },
    { name: "Семейный", rooms: 3, guests: 4, basePrice: 45000 },
    { name: "Люкс 3к панорамный", rooms: 1, guests: 6, basePrice: 85000 }
  ];

  const occupancyRanges = [
    { label: "До 20%", multiplier: 1.0 },
    { label: "20-40%", multiplier: 1.15 },
    { label: "40-60%", multiplier: 1.3 },
    { label: "60-80%", multiplier: 1.45 },
    { label: "80%+", multiplier: 1.6 }
  ];



  // Расчет цены
  const calculatePrice = (basePrice: number, guests: number, multiplier: number, view: string) => {
    let price = basePrice;
    if (view === 'occupancy') {
      price = (basePrice + (guests * constants.breakfastPrice)) * multiplier;
    } else if (view === 'season') {
      price = basePrice * constants.seasonMultiplier * multiplier;
    } else if (view === 'competitors') {
      price = basePrice * constants.competitorCoeff * multiplier;
    }
    return Math.round(price);
  };

  // Данные для графиков
  const revenueData = [
    { month: 'Янв', revenue: 2800000, occupancy: 68 },
    { month: 'Фев', revenue: 3200000, occupancy: 72 },
    { month: 'Мар', revenue: 4100000, occupancy: 85 },
    { month: 'Апр', revenue: 3800000, occupancy: 78 },
    { month: 'Май', revenue: 4500000, occupancy: 92 },
    { month: 'Июн', revenue: 5200000, occupancy: 98 },
  ];

  const competitorData = [
    { hotel: 'Наш отель', price: 42500, bookings: 156 },
    { hotel: 'Гранд Шале', price: 39800, bookings: 143 },
    { hotel: 'Альпина Резорт', price: 45200, bookings: 128 },
    { hotel: 'Горный Дом', price: 38900, bookings: 167 },
  ];

  // Генерируем календарные данные на месяц вперед
  const generateCalendarData = () => {
    const data = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const occupancy = Math.floor(Math.random() * 40) + 60; // 60-100%
      const revenue = occupancy * 1000 + Math.random() * 20000;
      data.push({
        date: date.toISOString().split('T')[0],
        day: date.getDate(),
        weekday: date.toLocaleDateString('ru-RU', { weekday: 'short' }),
        occupancy,
        revenue: Math.round(revenue),
        forecast: Math.random() > 0.7 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low'
      });
    }
    return data;
  };

  const calendarData = generateCalendarData();

  const updateConstant = (key: string, value: number) => {
    setConstants(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Icon name="TrendingUp" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Revenue Management Platform</h1>
                <p className="text-sm text-gray-600">Автоматизация управления доходами отеля</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Icon name="Zap" size={14} className="mr-1" />
                Пробный период
              </Badge>
              <Button variant="outline">
                <Icon name="User" size={16} className="mr-2" />
                Профиль
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Общий доход</p>
                  <p className="text-2xl font-bold text-gray-900">₽4.8M</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <Icon name="TrendingUp" size={12} className="mr-1" />
                    +12% к прошлому месяцу
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon name="DollarSign" size={24} className="text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Загрузка</p>
                  <p className="text-2xl font-bold text-gray-900">87%</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <Icon name="TrendingUp" size={12} className="mr-1" />
                    +5% к прошлой неделе
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Icon name="Users" size={24} className="text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">ADR</p>
                  <p className="text-2xl font-bold text-gray-900">₽43,200</p>
                  <p className="text-sm text-red-600 flex items-center mt-1">
                    <Icon name="TrendingDown" size={12} className="mr-1" />
                    -2% к прошлому месяцу
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Icon name="Calculator" size={24} className="text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">RevPAR</p>
                  <p className="text-2xl font-bold text-gray-900">₽37,584</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <Icon name="TrendingUp" size={12} className="mr-1" />
                    +8% к прошлому месяцу
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Icon name="BarChart3" size={24} className="text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Календарь прогнозов */}
          <Card className="xl:col-span-2 bg-white shadow-sm border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Icon name="Calendar" size={20} className="mr-2 text-green-600" />
                  Прогноз загрузки на месяц
                </div>
                <Dialog open={showSettings} onOpenChange={setShowSettings}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Icon name="Settings" size={16} className="mr-2" />
                      Настройки
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
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
              <div className="grid grid-cols-7 gap-2">
                {calendarData.slice(0, 21).map((day, index) => {
                  const bgColor = 
                    day.occupancy >= 90 ? 'bg-red-100 border-red-300 text-red-900' :
                    day.occupancy >= 75 ? 'bg-yellow-100 border-yellow-300 text-yellow-900' :
                    'bg-green-100 border-green-300 text-green-900';
                  
                  return (
                    <div 
                      key={index} 
                      className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${bgColor}`}
                      onClick={() => setSelectedDate(new Date(day.date))}
                    >
                      <div className="text-center">
                        <div className="text-sm font-bold">{day.day}</div>
                        <div className="text-xs mt-1">{day.occupancy}%</div>
                        {day.forecast === 'high' && (
                          <Icon name="TrendingUp" size={12} className="mx-auto mt-1" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between items-center mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
                    <span className="text-sm text-gray-600">60-75%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded"></div>
                    <span className="text-sm text-gray-600">75-90%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
                    <span className="text-sm text-gray-600">90%+</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Средняя загрузка: <span className="font-bold text-gray-900">82%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Детали выбранного дня */}
          <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
            <CardHeader>
              <CardTitle className="flex items-center text-indigo-900">
                <Icon name="Calendar" size={20} className="mr-2" />
                {selectedDate.toLocaleDateString('ru-RU', { 
                  day: 'numeric',
                  month: 'long',
                  weekday: 'long'
                })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-indigo-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Прогноз загрузки</span>
                  <span className="text-lg font-bold text-indigo-900">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-indigo-600 h-3 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-indigo-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Ожидаемый доход</span>
                  <span className="text-lg font-bold text-green-700">₽156,000</span>
                </div>
                <p className="text-xs text-gray-500">+12% к среднему</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-indigo-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Стандарт Мини</span>
                  </div>
                  <span className="text-sm font-medium">2/2</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-indigo-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Стандарт</span>
                  </div>
                  <span className="text-sm font-medium">4/5</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-indigo-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Люкс 3к</span>
                  </div>
                  <span className="text-sm font-medium">1/1</span>
                </div>
              </div>

              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                <Icon name="Eye" size={16} className="mr-2" />
                Подробная аналитика
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
          {/* Матрица цен */}
          <Card className="bg-white shadow-sm border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Матрица цен</span>
                <Tabs value={activeView} onValueChange={setActiveView} className="w-auto">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="occupancy" className="text-xs">Загрузка</TabsTrigger>
                    <TabsTrigger value="season" className="text-xs">Сезон</TabsTrigger>
                    <TabsTrigger value="competitors" className="text-xs">Конкуренты</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left p-3 font-medium text-gray-600">Категория номера</th>
                      {occupancyRanges.map((range) => (
                        <th key={range.label} className="text-center p-3 font-medium text-gray-600 min-w-[100px]">
                          {range.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {roomTypes.map((room, idx) => (
                      <tr key={room.name} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                        <td className="p-3 font-medium text-gray-900">{room.name}</td>
                        {occupancyRanges.map((range) => {
                          const price = calculatePrice(room.basePrice, room.guests, range.multiplier, activeView);
                          return (
                            <td key={range.label} className="text-center p-3">
                              <div className="flex flex-col items-center">
                                <span className="font-bold text-gray-900">
                                  {price.toLocaleString()} ₽
                                </span>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min(range.multiplier * 60, 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Аналитика доходов */}
          <Card className="bg-white shadow-sm border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Icon name="LineChart" size={20} className="mr-2 text-blue-600" />
                Динамика доходов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? `₽${(value as number).toLocaleString()}` : `${value}%`,
                      name === 'revenue' ? 'Доход' : 'Загрузка'
                    ]}
                    labelFormatter={(label) => `Месяц: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#2563eb" 
                    strokeWidth={3}
                    dot={{ fill: '#2563eb', strokeWidth: 2, r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="occupancy" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Анализ конкурентов и рекомендации */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-8">
          <Card className="xl:col-span-2 bg-white shadow-sm border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Icon name="Users" size={20} className="mr-2 text-purple-600" />
                Анализ конкурентов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={competitorData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hotel" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'price' ? `₽${(value as number).toLocaleString()}` : value,
                      name === 'price' ? 'Цена' : 'Бронирования'
                    ]}
                  />
                  <Bar dataKey="price" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-900">
                <Icon name="Lightbulb" size={20} className="mr-2" />
                Умные рекомендации
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Icon name="TrendingUp" size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Повысить цены</p>
                    <p className="text-gray-600 text-xs mt-1">
                      Увеличьте тариф "Люкс 3к" на 12% — спрос вырос на 18%
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Icon name="Clock" size={16} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Оптимизировать период</p>
                    <p className="text-gray-600 text-xs mt-1">
                      Снизить цены на 15-20 марта для улучшения загрузки
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Icon name="Target" size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Конкурентное преимущество</p>
                    <p className="text-gray-600 text-xs mt-1">
                      Ваши цены на 8% ниже Альпина Резорт — можно повысить
                    </p>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Применить рекомендации
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;