import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Building,
  Component,
  Quote,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Activity,
  Plus,
  Upload,
  Link,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
} from 'lucide-react';

export default function Dashboard() {
  const metrics = [
    {
      title: 'Total Components',
      value: '1,247',
      change: '+12%',
      trend: 'up',
      icon: Component,
      description: 'Components in ontology',
    },
    {
      title: 'Active Quotes',
      value: '89',
      change: '+23%',
      trend: 'up',
      icon: Quote,
      description: 'This month',
    },
    {
      title: 'Success Rate',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      icon: CheckCircle,
      description: 'Quote generation accuracy',
    },
    {
      title: 'Avg. Processing Time',
      value: '2.4s',
      change: '-0.3s',
      trend: 'down',
      icon: Clock,
      description: 'Per quote generation',
    },
  ];

  const quickActions = [
    {
      title: 'Generate New Quote',
      description: 'Create quotes using AI automation',
      icon: Quote,
      href: '/quotes/generate',
      variant: 'default',
    },
    {
      title: 'Upload Components',
      description: 'Add new components to ontology',
      icon: Upload,
      href: '/components/upload',
      variant: 'outline',
    },
    {
      title: 'Build Relations',
      description: 'Define component relationships',
      icon: Link,
      href: '/components/relations',
      variant: 'outline',
    },
    {
      title: 'View Ontology',
      description: 'Explore component structure',
      icon: Building,
      href: '/ontology',
      variant: 'outline',
    },
  ];

  const recentActivity = [
    {
      type: 'quote',
      title: 'Quote #QT-2024-0156 generated',
      description: 'Industrial pump system - $45,230',
      time: '2 minutes ago',
      status: 'completed',
      icon: Quote,
    },
    {
      type: 'upload',
      title: '12 new components uploaded',
      description: 'Hydraulic systems category',
      time: '15 minutes ago',
      status: 'completed',
      icon: Upload,
    },
    {
      type: 'relation',
      title: 'New relationship created',
      description: 'Motor → Pump compatibility',
      time: '1 hour ago',
      status: 'completed',
      icon: Link,
    },
    {
      type: 'quote',
      title: 'Quote #QT-2024-0155 generated',
      description: 'HVAC control system - $12,890',
      time: '2 hours ago',
      status: 'completed',
      icon: Quote,
    },
    {
      type: 'alert',
      title: 'Ontology validation warning',
      description: '3 components missing specifications',
      time: '3 hours ago',
      status: 'warning',
      icon: AlertTriangle,
    },
  ];

  const ontologyHealth = {
    componentCoverage: 87,
    relationshipCompleteness: 92,
    dataQuality: 94,
    missingSpecs: 23,
  };

  const topComponents = [
    { name: 'Industrial Pumps', quotes: 145, trend: '+12%' },
    { name: 'Control Valves', quotes: 128, trend: '+8%' },
    { name: 'Motors & Drives', quotes: 98, trend: '+15%' },
    { name: 'Sensors', quotes: 87, trend: '+5%' },
    { name: 'Piping Systems', quotes: 76, trend: '+18%' },
  ];

  const navigationCards = [
    {
      title: 'Components',
      count: '1,247',
      description: 'Total components',
      icon: Component,
      href: '/components',
    },
    {
      title: 'Quotes',
      count: '89',
      description: 'Active this month',
      icon: Quote,
      href: '/quotes',
    },
    {
      title: 'Relations',
      count: '3,456',
      description: 'Defined relationships',
      icon: Link,
      href: '/components/relations',
    },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="p-8 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back! Here's your AI quote automation overview.</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Generate Quote
          </Button>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <metric.icon className="h-5 w-5 text-muted-foreground mb-2" />
                    <div
                      className={`flex items-center gap-1 text-xs ${
                        metric.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                      {metric.trend === 'up' ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      {metric.change}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="lg:col-span-2 bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.variant}
                    className="h-auto p-4 justify-start flex-col items-start gap-2">
                    <div className="flex items-center gap-2 w-full">
                      <action.icon className="h-5 w-5" />
                      <span className="font-medium">{action.title}</span>
                    </div>
                    <span className="text-xs opacity-80 text-left">{action.description}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation Cards */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {navigationCards.map((card, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <card.icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">{card.title}</p>
                      <p className="text-xs text-muted-foreground">{card.description}</p>
                    </div>
                  </div>
                  <span className="font-bold text-foreground">{card.count}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest updates and system events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <activity.icon
                      className={`h-5 w-5 mt-0.5 ${
                        activity.status === 'warning'
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-green-600 dark:text-green-400'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                    <Badge variant={activity.status === 'warning' ? 'destructive' : 'secondary'} className="text-xs">
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ontology Health */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <BarChart3 className="h-5 w-5" />
                Ontology Health
              </CardTitle>
              <CardDescription>System completeness and data quality metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground">Component Coverage</span>
                    <span className="text-muted-foreground">{ontologyHealth.componentCoverage}%</span>
                  </div>
                  <Progress value={ontologyHealth.componentCoverage} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground">Relationship Completeness</span>
                    <span className="text-muted-foreground">{ontologyHealth.relationshipCompleteness}%</span>
                  </div>
                  <Progress value={ontologyHealth.relationshipCompleteness} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground">Data Quality</span>
                    <span className="text-muted-foreground">{ontologyHealth.dataQuality}%</span>
                  </div>
                  <Progress value={ontologyHealth.dataQuality} className="h-2" />
                </div>
              </div>

              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    {ontologyHealth.missingSpecs} components need specifications
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Components */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <TrendingUp className="h-5 w-5" />
              Most Quoted Components
            </CardTitle>
            <CardDescription>Components with highest quote generation activity this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topComponents.map((component, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{component.name}</p>
                      <p className="text-sm text-muted-foreground">{component.quotes} quotes generated</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-green-700 dark:text-green-300">
                    {component.trend}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
