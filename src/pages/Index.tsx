import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Index = () => {
  const [activeView, setActiveView] = useState('occupancy');

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

  const constants = {
    breakfastPrice: 3500,
    seasonMultiplier: 1.2,
    competitorCoeff: 0.95
  };

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

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
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