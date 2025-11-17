'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, UtensilsCrossed } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual' | null>(null)

  const plans = [
    {
      id: 'monthly',
      name: 'Plano Mensal',
      price: 'R$ 99',
      period: '/mês',
      features: [
        'Cardápio digital ilimitado',
        'QR Codes para todas as mesas',
        'Gestão de pedidos em tempo real',
        'Dashboard com relatórios',
        'Suporte por email',
      ],
    },
    {
      id: 'annual',
      name: 'Plano Anual',
      price: 'R$ 990',
      period: '/ano',
      badge: 'Economize 17%',
      features: [
        'Cardápio digital ilimitado',
        'QR Codes para todas as mesas',
        'Gestão de pedidos em tempo real',
        'Dashboard com relatórios',
        'Suporte prioritário',
        '2 meses grátis',
      ],
    },
  ]

  const handleSelectPlan = (planId: 'monthly' | 'annual') => {
    setSelectedPlan(planId)
    // Redireciona para página de cadastro com o plano selecionado
    router.push(`/signup?plan=${planId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-8 h-8 text-orange-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              RestaurantePro
            </span>
          </div>
          <Button 
            variant="outline" 
            onClick={() => router.push('/login')}
            className="border-orange-200 hover:bg-orange-50"
          >
            Já tenho conta
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            Modernize seu restaurante com{' '}
            <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              cardápio digital
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Sistema completo de pedidos com QR Code. Seus clientes pedem direto da mesa,
            você gerencia tudo em tempo real.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Escolha seu plano
            </h2>
            <p className="text-lg text-gray-600">
              Sem taxas escondidas. Cancele quando quiser.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative transition-all duration-300 hover:shadow-2xl ${
                  plan.id === 'annual'
                    ? 'border-orange-500 shadow-xl scale-105'
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <CardHeader className="text-center pb-8 pt-8">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </CardContent>

                <CardFooter>
                  <Button
                    onClick={() => handleSelectPlan(plan.id as 'monthly' | 'annual')}
                    className={`w-full h-12 text-lg ${
                      plan.id === 'annual'
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600'
                        : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                  >
                    Começar agora
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white border-t py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <UtensilsCrossed className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg">Fácil de usar</h3>
              <p className="text-gray-600 text-sm">
                Configure seu cardápio em minutos. Interface intuitiva e moderna.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg">Sem complicação</h3>
              <p className="text-gray-600 text-sm">
                Clientes pedem direto da mesa. Você recebe tudo em tempo real.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg">Relatórios completos</h3>
              <p className="text-gray-600 text-sm">
                Acompanhe vendas, produtos mais pedidos e muito mais.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2024 RestaurantePro. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
