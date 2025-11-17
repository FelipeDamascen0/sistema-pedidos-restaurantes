'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { UtensilsCrossed, ArrowLeft, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [supabaseConfigured, setSupabaseConfigured] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    // Verifica se o Supabase está configurado
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const isConfigured = supabaseUrl && !supabaseUrl.includes('placeholder')
    setSupabaseConfigured(isConfigured)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    // Verifica se Supabase está configurado antes de tentar login
    if (!supabaseConfigured) {
      toast.error('Configure o Supabase primeiro nas integrações')
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        // Trata erros específicos
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Email ou senha incorretos')
        }
        throw error
      }

      toast.success('Login realizado com sucesso!')
      router.push('/admin')

    } catch (error: any) {
      console.error('Erro no login:', error)
      
      // Mensagens de erro mais amigáveis
      if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
        toast.error('Erro de conexão. Verifique se o Supabase está configurado corretamente.')
      } else {
        toast.error(error.message || 'Email ou senha incorretos')
      }
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

        {!supabaseConfigured && (
          <Alert className="mb-4 border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Supabase não configurado!</strong>
              <br />
              Para fazer login, você precisa:
              <ol className="list-decimal ml-4 mt-2 space-y-1">
                <li>Ir em <strong>Configurações do Projeto</strong></li>
                <li>Acessar <strong>Integrações</strong></li>
                <li>Conectar sua conta <strong>Supabase</strong></li>
                <li>Executar os scripts SQL fornecidos na documentação</li>
              </ol>
            </AlertDescription>
          </Alert>
        )}

        <Card className="shadow-xl border-orange-100">
          <CardHeader>
            <CardTitle className="text-2xl">Entrar no painel</CardTitle>
            <CardDescription>
              Acesse o painel administrativo do seu restaurante
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@teste.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={loading || !supabaseConfigured}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Admin123!"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={loading || !supabaseConfigured}
                />
              </div>

              {supabaseConfigured && (
                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
                  <strong>Credenciais de teste:</strong>
                  <br />
                  Email: admin@teste.com
                  <br />
                  Senha: Admin123!
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                disabled={loading || !supabaseConfigured}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>

              <div className="text-center space-y-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.push('/')}
                  disabled={loading}
                  className="w-full text-gray-600"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar para página inicial
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Ainda não tem conta?{' '}
            <button
              onClick={() => router.push('/')}
              className="text-orange-600 hover:text-orange-700 font-semibold"
            >
              Escolha um plano
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
