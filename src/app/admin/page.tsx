"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Order, Restaurant } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, Clock, DollarSign, Users, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/ProtectedRoute'

function AdminContent() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pedidos')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Carregar restaurante do usuário
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: restaurantData } = await supabase
        .from('restaurants')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (restaurantData) {
        setRestaurant(restaurantData)

        // Carregar pedidos do restaurante
        const { data: ordersData } = await supabase
          .from('orders')
          .select('*, tables(table_number)')
          .eq('restaurant_id', restaurantData.id)
          .order('created_at', { ascending: false })

        if (ordersData) {
          setOrders(ordersData)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: 'em_andamento' | 'aguardando_pagamento' | 'pago') => {
    try {
      const updateData: any = { status: newStatus }
      if (newStatus === 'pago') {
        updateData.paid_at = new Date().toISOString()
      }

      await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)

      loadData()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      em_andamento: { color: 'bg-blue-500', label: 'Em Andamento' },
      aguardando_pagamento: { color: 'bg-yellow-500', label: 'Aguardando Pagamento' },
      pago: { color: 'bg-green-500', label: 'Pago' }
    }
    const variant = variants[status] || variants.em_andamento
    return (
      <Badge className={`${variant.color} text-white`}>
        {variant.label}
      </Badge>
    )
  }

  const activeOrders = orders.filter(o => o.status !== 'pago')
  const paidOrders = orders.filter(o => o.status === 'pago')
  const totalRevenue = paidOrders.reduce((sum, order) => sum + Number(order.total), 0)
  const uniqueGuests = new Set(orders.map(o => o.guest_id)).size

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-white text-xl">Carregando dados...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Painel Administrativo
            </h1>
            <p className="text-slate-300">
              {restaurant?.name || 'Restaurante'}
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                Faturamento Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">
                R$ {totalRevenue.toFixed(2)}
              </p>
              <p className="text-slate-300 text-sm mt-1">
                {paidOrders.length} pedidos pagos
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                Pedidos Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">
                {activeOrders.length}
              </p>
              <p className="text-slate-300 text-sm mt-1">
                Aguardando atenção
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Clientes Únicos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">
                {uniqueGuests}
              </p>
              <p className="text-slate-300 text-sm mt-1">
                Total de visitantes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-white/10 border border-white/20">
            <TabsTrigger value="pedidos" className="data-[state=active]:bg-white/20 text-white">
              Pedidos Ativos ({activeOrders.length})
            </TabsTrigger>
            <TabsTrigger value="historico" className="data-[state=active]:bg-white/20 text-white">
              Histórico
            </TabsTrigger>
            <TabsTrigger value="clientes" className="data-[state=active]:bg-white/20 text-white">
              Clientes
            </TabsTrigger>
          </TabsList>

          {/* Pedidos Ativos */}
          <TabsContent value="pedidos" className="space-y-4">
            {activeOrders.length === 0 ? (
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="py-12 text-center">
                  <p className="text-slate-300 text-lg">Nenhum pedido ativo no momento</p>
                </CardContent>
              </Card>
            ) : (
              activeOrders.map((order: any) => (
                <Card key={order.id} className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <CardTitle className="text-white text-xl mb-2">
                          {order.guest_name}
                        </CardTitle>
                        <CardDescription className="text-slate-300">
                          {order.tables?.table_number ? `Mesa ${order.tables.table_number}` : 'Para Viagem'} • 
                          {new Date(order.created_at).toLocaleString('pt-BR')}
                        </CardDescription>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Items */}
                      <div className="space-y-2">
                        {(order.items as any[]).map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between text-slate-200">
                            <span>{item.quantity}x {item.product_name}</span>
                            <span>R$ {item.total.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Total */}
                      <div className="border-t border-white/20 pt-3 flex justify-between items-center">
                        <span className="text-white font-bold text-lg">Total</span>
                        <span className="text-white font-bold text-xl">
                          R$ {Number(order.total).toFixed(2)}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-3">
                        {order.status === 'em_andamento' && (
                          <Button
                            onClick={() => updateOrderStatus(order.id, 'aguardando_pagamento')}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white"
                          >
                            Marcar como Aguardando Pagamento
                          </Button>
                        )}
                        {order.status === 'aguardando_pagamento' && (
                          <Button
                            onClick={() => updateOrderStatus(order.id, 'pago')}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Marcar como Pago
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Histórico */}
          <TabsContent value="historico" className="space-y-4">
            {paidOrders.length === 0 ? (
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="py-12 text-center">
                  <p className="text-slate-300 text-lg">Nenhum pedido pago ainda</p>
                </CardContent>
              </Card>
            ) : (
              paidOrders.map((order: any) => (
                <Card key={order.id} className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <CardTitle className="text-white text-xl mb-2">
                          {order.guest_name}
                        </CardTitle>
                        <CardDescription className="text-slate-300">
                          {order.tables?.table_number ? `Mesa ${order.tables.table_number}` : 'Para Viagem'} • 
                          Pago em {new Date(order.paid_at).toLocaleString('pt-BR')}
                        </CardDescription>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Items */}
                      <div className="space-y-2">
                        {(order.items as any[]).map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between text-slate-200">
                            <span>{item.quantity}x {item.product_name}</span>
                            <span>R$ {item.total.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Total */}
                      <div className="border-t border-white/20 pt-3 flex justify-between items-center">
                        <span className="text-white font-bold text-lg">Total</span>
                        <span className="text-white font-bold text-xl">
                          R$ {Number(order.total).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Clientes */}
          <TabsContent value="clientes" className="space-y-4">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Lista de Clientes</CardTitle>
                <CardDescription className="text-slate-300">
                  Todos os clientes que fizeram pedidos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from(new Set(orders.map(o => o.guest_id))).map(guestId => {
                    const guestOrders = orders.filter(o => o.guest_id === guestId)
                    const guestName = guestOrders[0]?.guest_name
                    const totalSpent = guestOrders
                      .filter(o => o.status === 'pago')
                      .reduce((sum, o) => sum + Number(o.total), 0)
                    const isPaid = guestOrders.some(o => o.status === 'pago')

                    return (
                      <div
                        key={guestId}
                        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div>
                          <p className="text-white font-semibold">{guestName}</p>
                          <p className="text-slate-300 text-sm">
                            {guestOrders.length} pedido(s) • R$ {totalSpent.toFixed(2)} gasto
                          </p>
                        </div>
                        <Badge className={isPaid ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}>
                          {isPaid ? 'Pagou' : 'Pendente'}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminContent />
    </ProtectedRoute>
  )
}
