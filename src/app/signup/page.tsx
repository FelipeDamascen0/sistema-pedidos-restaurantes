'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UtensilsCrossed, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan') as 'monthly' | 'annual' || 'monthly'

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    restaurantName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const planDetails = {
    monthly: { name: 'Plano Mensal', price: 'R$ 99/mês' },
    annual: { name: 'Plano Anual', price: 'R$ 990/ano' },
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem')
      return
    }

    if (formData.password.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres')
      return
    }

    setLoading(true)

    try {
      // 1. Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (authError) throw authError

      if (!authData.user) {
        throw new Error('Erro ao criar usuário')
      }

      // 2. Criar registro do restaurante
      const planExpiresAt = new Date()
      if (plan === 'monthly') {
        planExpiresAt.setMonth(planExpiresAt.getMonth() + 1)
      } else {
        planExpiresAt.setFullYear(planExpiresAt.getFullYear() + 1)
      }

      const { error: restaurantError } = await supabase
        .from('restaurants')
        .insert({
          name: formData.restaurantName,
          email: formData.email,
          plan: plan,
          plan_expires_at: planExpiresAt.toISOString(),
          user_id: authData.user.id,
        })

      if (restaurantError) throw restaurantError

      toast.success('Conta criada com sucesso! Redirecionando...')
      
      // Redirecionar para o painel
      setTimeout(() => {
        router.push('/admin')
      }, 1500)

    } catch (error: any) {
      console.error('Erro no cadastro:', error)
      toast.error(error.message || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <UtensilsCrossed className="w-10 h-10 text-orange-600" />
            <span className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              RestaurantePro
            </span>
          </div>
        </div>

        <Card className="shadow-xl border-orange-100">
          <CardHeader>
            <CardTitle className="text-2xl">Criar conta</CardTitle>
            <CardDescription>
              Plano selecionado: <span className="font-semibold text-orange-600">{planDetails[plan].name}</span> - {planDetails[plan].price}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="restaurantName">Nome do restaurante</Label>
                <Input
                  id="restaurantName"
                  type="text"
                  placeholder="Ex: Pizzaria do João"
                  value={formData.restaurantName}
                  onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Digite a senha novamente"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                disabled={loading}
              >
                {loading ? 'Criando conta...' : 'Criar conta e começar'}
              </Button>

              <div className="text-center space-y-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push('/login')}
                  disabled={loading}
                  className="w-full"
                >
                  Já tenho conta
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push('/')}
                  disabled={loading}
                  className="w-full text-gray-600"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar para planos
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-600 mt-6">
          Ao criar uma conta, você concorda com nossos termos de uso
        </p>
      </div>
    </div>
  )
}
