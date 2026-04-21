import React, { useState } from 'react';
import { Routes, Route, Navigate, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Modal } from './Modal';
import { BottomNav } from './BottomNav';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Calendar, 
  MessageSquare, 
  Settings, 
  LogOut,
  Menu,
  Bell,
  Search,
  ChevronDown,
  ChevronUp,
  Activity,
  DollarSign,
  TrendingUp,
  FileText,
  Heart,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  MoreHorizontal,
  Plus,
  ArrowLeft,
  Upload,
  X,
  MapPin,
  Send,
  ExternalLink
} from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';
import { AITranslate } from './AITranslate';
import { useI18n, I18nProvider } from '../I18nContext';
import { Language } from '../i18n';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '../lib/supabase';

// --- Mock Data & Types ---
type Role = 'admin' | 'clinic' | 'patient';

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
  roles: Role[];
}

const getNavItems = (t: any): NavItem[] => [
  { title: t.dashboard.dashboard, url: "/dashboard", icon: LayoutDashboard, roles: ['admin', 'clinic', 'patient'] },
  { title: t.dashboard.clinics, url: "/dashboard/clinics", icon: Building2, roles: ['admin'] },
  { title: t.dashboard.patients, url: "/dashboard/patients", icon: Users, roles: ['admin'] },
  { title: t.dashboard.myServices, url: "/dashboard/services", icon: FileText, roles: ['clinic'] },
  { title: t.dashboard.requests, url: "/dashboard/requests", icon: FileText, roles: ['admin', 'clinic', 'patient'] },
  { title: t.dashboard.settings, url: "/dashboard/settings", icon: Settings, roles: ['admin', 'clinic', 'patient'] },
];

// --- Components ---

function DashboardSidebar({ currentRole, onRoleChange, actualRole }: { currentRole: Role, onRoleChange: (r: Role) => void, actualRole: Role }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, lang } = useI18n();
  const langPrefix = lang === 'en' ? '' : `/${lang}`;

  const navItems = getNavItems(t);
  const filteredNavItems = navItems.filter(item => item.roles.includes(currentRole));

  return (
    <Sidebar className="top-[72px] h-[calc(100svh-72px)]">
      <SidebarHeader className="h-16 flex items-center px-4 border-b">
        <Link to={`${langPrefix}/`} className="flex items-center gap-2 font-bold text-xl text-navy">
          <div className="w-8 h-8 bg-blue rounded-lg flex items-center justify-center text-white font-sans border border-blue-dark/20 shadow-sm">
            G
          </div>
          {t.dashboard.myDashboard}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => navigate(`${langPrefix}${item.url}`)}
                    isActive={location.pathname === item.url || location.pathname === `${langPrefix}${item.url}`}
                  >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function DashboardHeader({ currentRole }: { currentRole: Role }) {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-4 sticky top-[72px] z-10">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="h-9 w-64 rounded-md border border-input bg-background pl-9 pr-4 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>
    </header>
  );
}

// --- Dashboard Views ---

const data = [
  { name: 'Jan', total: 1200 },
  { name: 'Feb', total: 2100 },
  { name: 'Mar', total: 1800 },
  { name: 'Apr', total: 2400 },
  { name: 'May', total: 2800 },
  { name: 'Jun', total: 3200 },
];

const pieData = [
  { name: 'Dental', value: 400 },
  { name: 'Hair', value: 300 },
  { name: 'Aesthetics', value: 300 },
  { name: 'Eye', value: 200 },
];
const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];

function AdminDashboard() {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t.dashboard.adminOverview}</h2>
          <p className="text-muted-foreground">{t.dashboard.adminOverviewDesc}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.totalRevenue}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground flex items-center text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.activeClinics}</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,350</div>
            <p className="text-xs text-muted-foreground flex items-center text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +180 new this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.totalPatients}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,234</div>
            <p className="text-xs text-muted-foreground flex items-center text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.activeAppointments}</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground flex items-center text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +201 since last hour
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t.dashboard.platformGrowth}</CardTitle>
            <CardDescription>{t.dashboard.platformGrowthDesc}</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="total" stroke="#2563eb" fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>{t.dashboard.treatmentsBreakdown}</CardTitle>
            <CardDescription>{t.dashboard.treatmentsBreakdownDesc}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4 text-sm">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                <span className="text-muted-foreground">{entry.name}</span>
              </div>
            ))}
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.dashboard.recentTransactions}</CardTitle>
          <CardDescription>{t.dashboard.recentTransactionsDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.dashboard.tablePatient}</TableHead>
                <TableHead>{t.dashboard.tableClinic}</TableHead>
                <TableHead>{t.dashboard.tableStatus}</TableHead>
                <TableHead>{t.dashboard.tableDate}</TableHead>
                <TableHead className="text-right">{t.dashboard.tableAmount}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { patient: "Liam Smith", clinic: "Smile Dental Care", status: "Completed", date: "Today, 10:24 AM", amount: "$1,250.00" },
                { patient: "Emma Johnson", clinic: "Istanbul Hair Clinic", status: "Processing", date: "Today, 09:12 AM", amount: "$2,400.00" },
                { patient: "Noah Williams", clinic: "Aesthetic Hub", status: "Completed", date: "Yesterday, 04:30 PM", amount: "$850.00" },
                { patient: "Olivia Brown", clinic: "Vision Eye Center", status: "Failed", date: "Yesterday, 02:15 PM", amount: "$1,100.00" },
                { patient: "William Jones", clinic: "Smile Dental Care", status: "Completed", date: "Oct 24, 2026", amount: "$3,200.00" },
              ].map((tx, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{tx.patient}</TableCell>
                  <TableCell>{tx.clinic}</TableCell>
                  <TableCell>
                    <Badge variant={tx.status === 'Completed' ? 'default' : tx.status === 'Processing' ? 'secondary' : 'destructive'}>
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                  <TableCell className="text-right font-medium">{tx.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function ClinicDashboard() {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t.dashboard.clinicDashboard}</h2>
          <p className="text-muted-foreground">{t.dashboard.clinicDashboardDesc}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.todaysAppointments}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">4 remaining today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.newPatients}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+48</div>
            <p className="text-xs text-muted-foreground flex items-center text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.monthlyRevenue}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-muted-foreground flex items-center text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +8% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.profileViews}</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">892</div>
            <p className="text-xs text-muted-foreground flex items-center text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> +24% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t.dashboard.patientVisits}</CardTitle>
            <CardDescription>{t.dashboard.patientVisitsDesc}</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip cursor={{fill: '#f3f4f6'}} />
                  <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>{t.dashboard.upcomingAppointments}</CardTitle>
            <CardDescription>{t.dashboard.upcomingAppointmentsDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { time: "09:00 AM", name: "Sarah Johnson", treatment: "Dental Implant", status: "Confirmed" },
                { time: "10:30 AM", name: "Michael Chen", treatment: "Follow-up", status: "In Waiting Room" },
                { time: "11:45 AM", name: "Emma Davis", treatment: "Assessment", status: "Confirmed" },
                { time: "02:00 PM", name: "James Wilson", treatment: "Whitening", status: "Pending" },
                { time: "03:30 PM", name: "Olivia Brown", treatment: "Consultation", status: "Confirmed" },
              ].map((apt, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 text-center">
                      <div className="text-sm font-semibold text-navy">{apt.time.split(' ')[0]}</div>
                      <div className="text-[10px] text-muted-foreground">{apt.time.split(' ')[1]}</div>
                    </div>
                    <div className="w-px h-8 bg-border"></div>
                    <div>
                      <p className="text-sm font-medium leading-none">{apt.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{apt.treatment}</p>
                    </div>
                  </div>
                  <Badge variant={apt.status === 'In Waiting Room' ? 'default' : apt.status === 'Confirmed' ? 'secondary' : 'outline'}>
                    {apt.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t.dashboard.recentReviews}</CardTitle>
            <CardDescription>{t.dashboard.recentReviewsDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Alice Walker", rating: 5, comment: "Excellent service and very professional staff. Highly recommended!", date: "2 days ago" },
                { name: "David Lee", rating: 5, comment: "The procedure was painless and the results are amazing.", date: "1 week ago" },
                { name: "Sophia Martinez", rating: 4, comment: "Good experience overall, but had to wait a bit longer than expected.", date: "2 weeks ago" },
              ].map((review, i) => (
                <div key={i} className="flex flex-col space-y-1 pb-4 border-b last:border-0 last:pb-0">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold">{review.name}</span>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                  <div className="flex text-gold text-xs">
                    {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">{t.dashboard.viewAllReviews}</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t.dashboard.actionItems}</CardTitle>
            <CardDescription>{t.dashboard.actionItemsDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg border bg-red-50/50 border-red-100">
                <div className="mt-0.5"><Bell className="h-4 w-4 text-red-500" /></div>
                <div>
                  <p className="text-sm font-medium text-red-900">Confirm 3 pending appointments</p>
                  <p className="text-xs text-red-700 mt-1">Patients are waiting for confirmation for tomorrow.</p>
                </div>
                <Button size="sm" variant="outline" className="ml-auto shrink-0 bg-white">Review</Button>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg border bg-blue-50/50 border-blue-100">
                <div className="mt-0.5"><MessageSquare className="h-4 w-4 text-blue" /></div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Reply to 5 new messages</p>
                  <p className="text-xs text-blue-700 mt-1">Inquiries about hair transplant packages.</p>
                </div>
                <Button size="sm" variant="outline" className="ml-auto shrink-0 bg-white">Reply</Button>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg border bg-amber-50/50 border-amber-100">
                <div className="mt-0.5"><FileText className="h-4 w-4 text-amber-600" /></div>
                <div>
                  <p className="text-sm font-medium text-amber-900">Upload pre-op instructions</p>
                  <p className="text-xs text-amber-700 mt-1">For patient Emma Davis (Rhinoplasty).</p>
                </div>
                <Button size="sm" variant="outline" className="ml-auto shrink-0 bg-white">Upload</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PatientDashboard() {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t.dashboard.myHealthJourney}</h2>
          <p className="text-muted-foreground">{t.dashboard.myHealthJourneyDesc}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue to-blue-dark text-white border-none shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-50">{t.dashboard.nextAppointment}</CardTitle>
            <Calendar className="h-4 w-4 text-blue-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mt-2">Oct 24, 2026</div>
            <p className="text-sm text-blue-100 mt-1">09:00 AM • Smile Dental Care</p>
            <div className="mt-4 flex items-center text-xs text-blue-50 bg-white/10 w-fit px-2 py-1 rounded-md">
              <Clock className="w-3 h-3 mr-1" /> In 3 days
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.savedClinics}</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mt-2">4</div>
            <p className="text-sm text-muted-foreground mt-1">View your favorites</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.dashboard.unreadMessages}</CardTitle>
            <MessageSquare className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mt-2">2</div>
            <p className="text-sm text-muted-foreground mt-1">From Dr. Yilmaz</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t.dashboard.treatmentTimeline}</CardTitle>
            <CardDescription>{t.dashboard.treatmentTimelineDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative border-l-2 border-muted ml-3 space-y-8 pb-4 mt-2">
              <div className="relative pl-6">
                <span className="absolute left-[-9px] top-1 h-4 w-4 rounded-full bg-blue flex items-center justify-center ring-4 ring-white">
                  <CheckCircle2 className="h-3 w-3 text-white" />
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Initial Consultation</span>
                  <span className="text-xs text-muted-foreground mt-1">Completed - Sep 15, 2026</span>
                  <p className="text-sm text-muted-foreground mt-2 bg-muted/50 p-2 rounded-md">Dr. Yilmaz reviewed your X-rays and approved the treatment plan.</p>
                </div>
              </div>
              <div className="relative pl-6">
                <span className="absolute left-[-9px] top-1 h-4 w-4 rounded-full bg-blue flex items-center justify-center ring-4 ring-white">
                  <CheckCircle2 className="h-3 w-3 text-white" />
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Flight & Hotel Booking</span>
                  <span className="text-xs text-muted-foreground mt-1">Completed - Sep 20, 2026</span>
                </div>
              </div>
              <div className="relative pl-6">
                <span className="absolute left-[-9px] top-1 h-4 w-4 rounded-full bg-white border-2 border-blue ring-4 ring-white"></span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-blue">Arrival in Istanbul</span>
                  <span className="text-xs text-blue/80 mt-1">Scheduled - Oct 23, 2026</span>
                </div>
              </div>
              <div className="relative pl-6">
                <span className="absolute left-[-9px] top-1 h-4 w-4 rounded-full bg-muted border-2 border-muted-foreground/30 ring-4 ring-white"></span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground">Procedure Day</span>
                  <span className="text-xs text-muted-foreground mt-1">Scheduled - Oct 24, 2026</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.dashboard.medicalProfile}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">{t.dashboard.bloodType}</span>
                  <span className="font-medium">O+</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">{t.dashboard.allergies}</span>
                  <span className="font-medium">Penicillin</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">{t.dashboard.medications}</span>
                  <span className="font-medium">None</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-muted-foreground">{t.dashboard.emergencyContact}</span>
                  <span className="font-medium text-right">Jane Doe<br/><span className="text-xs text-muted-foreground">+1 234 567 8900</span></span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">{t.dashboard.updateProfile}</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t.dashboard.recentDocuments}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Treatment Plan.pdf", date: "Sep 16", size: "2.4 MB" },
                  { name: "Flight Itinerary.pdf", date: "Sep 20", size: "1.1 MB" },
                  { name: "Pre-op Instructions.pdf", date: "Oct 01", size: "850 KB" },
                ].map((doc, i) => (
                  <div key={i} className="flex items-center p-2 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer group">
                    <div className="h-8 w-8 rounded bg-blue/10 flex items-center justify-center text-blue mr-3 shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover:text-blue transition-colors">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.date} • {doc.size}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground shrink-0">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t.dashboard.paymentStatus}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                <div>
                  <p className="text-sm font-medium">{t.dashboard.totalBalance}</p>
                  <p className="text-xl font-bold mt-1">$3,200</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="mb-1">{t.dashboard.depositPaid}</Badge>
                  <p className="text-xs text-muted-foreground">{t.dashboard.rem}: $2,700</p>
                </div>
              </div>
              <Button className="w-full mt-3" variant="outline">{t.dashboard.viewInvoice}</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// --- Main Layout ---

function AddServicePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { lang, t } = useI18n();
  const langPrefix = lang === 'en' ? '' : `/${lang}`;
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Hair Transplant');
  const [countryCity, setCountryCity] = useState('Istanbul');
  const [regularPrice, setRegularPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string[]>(['']);
  const [included, setIncluded] = useState({
    vipTransfer: true,
    hotel: true,
    translator: true,
    aftercare: true
  });
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState('Active');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);

  React.useEffect(() => {
    if (id) {
      const fetchService = async () => {
        try {
          const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;

          if (data) {
            setTitle(data.name || '');
            setCategory(data.category || 'Hair Transplant');
            setCountryCity(data.country_city || '');
            
            // Parse price
            const priceStr = data.price || '';
            if (priceStr.includes('€')) {
              setRegularPrice(priceStr.replace('€', ''));
              // We don't have a separate offer price in DB currently, just using the single price
            } else {
              setRegularPrice(priceStr);
            }

            setDuration(data.duration || '');
            setDescription(data.description || '');
            
            if (data.features) {
              setFeatures(data.features.split(',').map((f: string) => f.trim()));
            }
            
            if (data.included) {
              setIncluded(data.included);
            }

            if (data.images && data.images.length > 0) {
              setImages(data.images);
            } else if (data.image) {
              setImages([data.image]);
            }

            setStatus(data.status || 'Active');
          }
        } catch (error) {
          console.error("Error fetching service:", error);
          alert("Failed to load service details.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchService();
    }
  }, [id]);
  
  const addFeature = () => setFeatures([...features, '']);
  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };
  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const newImages = [...images];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('service-images')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('service-images')
          .getPublicUrl(filePath);

        newImages.push(publicUrl);
      }

      setImages(newImages);
    } catch (error: any) {
      alert(`Error uploading image: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const serviceData = {
        clinic_id: user.id,
        name: title,
        category,
        price: offerPrice ? `€${offerPrice}` : `€${regularPrice}`,
        status,
        features: features.filter(f => f.trim() !== '').join(', '),
        description,
        country_city: countryCity,
        duration,
        included,
        images: images,
        image: images.length > 0 ? images[0] : "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&q=80&w=150&h=150"
      };
      
      if (id) {
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', id);
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('services')
          .insert([serviceData]);
          
        if (error) throw error;
      }
      
      // Also update local storage for the public pages to work temporarily
      const existingServices = JSON.parse(localStorage.getItem('clinic_services') || '[]');
      
      const newServiceObj = {
        id: id || Date.now().toString(),
        name: title,
        category,
        countryCity,
        regularPrice,
        offerPrice,
        price: offerPrice ? `€${offerPrice}` : `€${regularPrice}`,
        duration,
        description,
        features: features.filter(f => f.trim() !== '').join(', '),
        included,
        status,
        images: images,
        image: images.length > 0 ? images[0] : "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&q=80&w=150&h=150"
      };

      if (id) {
        const updatedServices = existingServices.map((s: any) => s.id === id ? newServiceObj : s);
        localStorage.setItem('clinic_services', JSON.stringify(updatedServices));
      } else {
        localStorage.setItem('clinic_services', JSON.stringify([newServiceObj, ...existingServices]));
      }

      alert(`✅ Service ${id ? 'updated' : 'saved'} successfully!`);
      navigate(`${langPrefix}/dashboard/services`);
    } catch (err: any) {
      alert(`Error saving service: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div>Loading service details...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(`${langPrefix}/dashboard/services`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{id ? t.dashboard.editService : t.dashboard.addNewService}</h2>
        </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.dashboard.mediaGallery}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-blue/50 transition-all cursor-pointer group relative">
                <input 
                  type="file" 
                  multiple 
                  accept="image/png, image/jpeg, image/gif, image/svg+xml" 
                  onChange={handleImageUpload} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isUploading}
                />
                <div className="w-12 h-12 rounded-full bg-blue/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="h-6 w-6 text-blue" />
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {isUploading ? t.dashboard.uploading : t.dashboard.clickToUpload}
                </p>
                <p className="text-xs text-gray-500 mt-1">{t.dashboard.uploadFormat}</p>
              </div>
              
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {images.map((img, index) => (
                    <div key={index} className="aspect-square rounded-md bg-muted relative group overflow-hidden border">
                      <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-white hover:text-red-400 hover:bg-transparent"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="aspect-square rounded-md border-2 border-dashed flex items-center justify-center text-muted-foreground hover:bg-muted/50 cursor-pointer transition-colors relative">
                    <input 
                      type="file" 
                      multiple 
                      accept="image/png, image/jpeg, image/gif, image/svg+xml" 
                      onChange={handleImageUpload} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isUploading}
                    />
                    <Plus className="h-5 w-5" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t.dashboard.basicDetails}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.dashboard.serviceName}</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue focus:border-blue outline-none transition-all" 
                  placeholder={t.dashboard.serviceNamePlaceholder} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.dashboard.description}</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md min-h-[150px] focus:ring-2 focus:ring-blue focus:border-blue outline-none transition-all resize-y" 
                  placeholder={t.dashboard.descriptionPlaceholder}
                ></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.dashboard.tableCategory}</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-blue focus:border-blue outline-none transition-all"
                  >
                    <option>{t.hero.procedures.hairTransplant}</option>
                    <option>{t.hero.procedures.dentalAesthetics}</option>
                    <option>{t.hero.procedures.facelift}</option>
                    <option>{t.hero.procedures.rhinoplasty}</option>
                    <option>{t.hero.procedures.eyelidSurgery}</option>
                    <option>{t.hero.procedures.liposuction}</option>
                    <option>{t.hero.procedures.breastAugmentation}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.dashboard.countryCity}</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-blue w-4 h-4 pointer-events-none" />
                    <input 
                      type="text"
                      value={countryCity}
                      onChange={(e) => setCountryCity(e.target.value)}
                      placeholder={t.hero.locationPlaceholder}
                      className="w-full py-2 pr-10 pl-9 border rounded-md bg-background focus:ring-2 focus:ring-blue focus:border-blue outline-none transition-all"
                    />
                    {countryCity && (
                      <button 
                        onClick={() => setCountryCity('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.dashboard.regularPrice}</label>
                  <input 
                    type="number" 
                    value={regularPrice}
                    onChange={(e) => setRegularPrice(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue focus:border-blue outline-none transition-all" 
                    placeholder="e.g. 3000" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.dashboard.offerPrice} <span className="text-muted-foreground font-normal">{t.dashboard.optional}</span></label>
                  <input 
                    type="number" 
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue focus:border-blue outline-none transition-all" 
                    placeholder="e.g. 2500" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.dashboard.procedureDuration}</label>
                  <input 
                    type="text" 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue focus:border-blue outline-none transition-all" 
                    placeholder={t.dashboard.durationPlaceholder} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t.dashboard.clinicFeatures}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1">
                      <input 
                        type="text" 
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue focus:border-blue outline-none transition-all" 
                        placeholder={t.dashboard.featurePlaceholder} 
                      />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFeature(index)} disabled={features.length === 1} className="text-muted-foreground hover:text-red-600">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addFeature} className="mt-2">
                  <Plus className="h-4 w-4 mr-2" /> {t.dashboard.addFeature}
                </Button>
              </div>
              
              <div className="pt-4 mt-4 border-t">
                <h4 className="text-sm font-medium mb-3">{t.dashboard.includedInPackages}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={included.vipTransfer}
                      onChange={(e) => setIncluded({...included, vipTransfer: e.target.checked})}
                      className="rounded border-gray-300 text-blue focus:ring-blue w-4 h-4" 
                    />
                    <span className="text-sm">{t.dashboard.vipTransfer}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={included.hotel}
                      onChange={(e) => setIncluded({...included, hotel: e.target.checked})}
                      className="rounded border-gray-300 text-blue focus:ring-blue w-4 h-4" 
                    />
                    <span className="text-sm">{t.dashboard.hotelIncluded}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={included.translator}
                      onChange={(e) => setIncluded({...included, translator: e.target.checked})}
                      className="rounded border-gray-300 text-blue focus:ring-blue w-4 h-4" 
                    />
                    <span className="text-sm">{t.dashboard.translator}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={included.aftercare}
                      onChange={(e) => setIncluded({...included, aftercare: e.target.checked})}
                      className="rounded border-gray-300 text-blue focus:ring-blue w-4 h-4" 
                    />
                    <span className="text-sm">{t.dashboard.aftercare}</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.dashboard.publishing}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.dashboard.status}</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-blue focus:border-blue outline-none transition-all"
                >
                  <option value="Draft">{t.dashboard.draft}</option>
                  <option value="Active">{t.dashboard.active}</option>
                  <option value="Archived">{t.dashboard.archived}</option>
                </select>
              </div>
              <div className="pt-2 space-y-2">
                <Button 
                  className="w-full bg-blue hover:bg-blue-dark text-white"
                  onClick={handleSave}
                  disabled={isSaving || !title}
                >
                  {isSaving ? t.dashboard.saving : t.dashboard.saveAndPublish}
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate(`${langPrefix}/dashboard/services`)} disabled={isSaving}>{t.dashboard.cancel}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ClinicSettings() {
  const { t } = useI18n();
  const [profile, setProfile] = useState({
    name: '',
    type: 'Premium',
    description: '',
    countryCity: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    instagram: '',
    facebook: '',
    twitter: '',
    username: '',
    accountEmail: '',
    language: 'English',
    timezone: 'Europe/Istanbul (GMT+3)',
    profilePicture: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=200&h=200&q=80',
    coverImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&h=400&q=80'
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('clinic_settings')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (data) {
            setProfile(prev => ({
              ...prev,
              username: data.username || '',
              name: data.clinic_name || '',
              description: data.description || '',
              address: data.address || '',
              countryCity: data.city || '',
              phone: data.phone || '',
              website: data.website || '',
              accountEmail: user.email || '',
              profilePicture: data.profile_picture || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=200&h=200&q=80',
              coverImage: data.cover_image || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&h=400&q=80'
            }));
          } else {
            setProfile(prev => ({ ...prev, accountEmail: user.email || '' }));
          }
        }
      } catch (err) {
        console.error('Error fetching clinic settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'profile') setIsUploadingProfile(true);
    else setIsUploadingCover(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${type}_${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('clinic-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('clinic-images')
        .getPublicUrl(filePath);

      setProfile(prev => ({
        ...prev,
        [type === 'profile' ? 'profilePicture' : 'coverImage']: publicUrl
      }));
    } catch (error: any) {
      alert(`Error uploading image: ${error.message}`);
    } finally {
      if (type === 'profile') setIsUploadingProfile(false);
      else setIsUploadingCover(false);
    }
  };

  const handleRemoveImage = (type: 'profile' | 'cover') => {
    setProfile(prev => ({
      ...prev,
      [type === 'profile' ? 'profilePicture' : 'coverImage']: type === 'profile' 
        ? 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=200&h=200&q=80'
        : 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&h=400&q=80'
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Upsert clinic settings
        const { error } = await supabase
          .from('clinic_settings')
          .upsert({
            id: user.id,
            username: profile.username,
            clinic_name: profile.name,
            description: profile.description,
            address: profile.address,
            city: profile.countryCity,
            phone: profile.phone,
            website: profile.website,
            profile_picture: profile.profilePicture,
            cover_image: profile.coverImage
          });
          
        if (error) throw error;
        alert('✅ Clinic profile saved successfully!');
      }
    } catch (err: any) {
      alert(`Error saving clinic settings: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t.dashboard.clinicProfileSettings}</h2>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t.dashboard.media}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gray-100 border overflow-hidden flex-shrink-0">
                <img src={profile.profilePicture} alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.dashboard.profilePicture}</label>
                <div className="flex gap-2">
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => handleImageUpload(e, 'profile')} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isUploadingProfile}
                    />
                    <Button variant="outline" size="sm" disabled={isUploadingProfile}>
                      {isUploadingProfile ? t.dashboard.uploading : t.dashboard.change}
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleRemoveImage('profile')}>{t.dashboard.remove}</Button>
                </div>
                <p className="text-xs text-muted-foreground">Recommended size: 400x400px. Max 2MB.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.dashboard.basicInformation}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.dashboard.clinicName}</label>
                <input type="text" name="name" value={profile.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue focus:border-blue outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.dashboard.typeCategory}</label>
                <select name="type" value={profile.type} onChange={handleChange} className="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-blue focus:border-blue outline-none transition-all">
                  <option>Premium</option>
                  <option>Standard</option>
                  <option>Boutique</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.dashboard.aboutDescription}</label>
              <textarea name="description" value={profile.description} onChange={handleChange} className="w-full px-3 py-2 border rounded-md min-h-[120px] focus:ring-2 focus:ring-blue focus:border-blue outline-none transition-all resize-y"></textarea>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.dashboard.locationContact}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.dashboard.countryCity}</label>
                <input type="text" name="countryCity" value={profile.countryCity} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue focus:border-blue outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.dashboard.fullAddress}</label>
                <input type="text" name="address" value={profile.address} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue focus:border-blue outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.dashboard.phoneNumber}</label>
                <input type="tel" name="phone" value={profile.phone} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue focus:border-blue outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.dashboard.emailAddress}</label>
                <input type="email" name="email" value={profile.email} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue focus:border-blue outline-none transition-all" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.dashboard.onlinePresence}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.dashboard.website}</label>
                <input type="url" name="website" value={profile.website} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue focus:border-blue outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.dashboard.instagram}</label>
                <input type="url" name="instagram" value={profile.instagram} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue focus:border-blue outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.dashboard.facebook}</label>
                <input type="url" name="facebook" value={profile.facebook} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue focus:border-blue outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.dashboard.twitter}</label>
                <input type="url" name="twitter" value={profile.twitter} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue focus:border-blue outline-none transition-all" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.dashboard.accountSettings}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.dashboard.username}</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    guzellik.app/mt/
                  </span>
                  <input type="text" name="username" value={profile.username} onChange={handleChange} className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border focus:ring-2 focus:ring-blue focus:border-blue outline-none transition-all" />
                </div>
                <p className="text-xs text-muted-foreground">This will be your public clinic link.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.dashboard.accountEmail}</label>
                <input type="email" name="accountEmail" value={profile.accountEmail} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue focus:border-blue outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.dashboard.newPassword}</label>
                <input type="password" name="password" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue focus:border-blue outline-none transition-all" placeholder="Leave blank to keep current" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.dashboard.confirmNewPassword}</label>
                <input type="password" name="confirmPassword" className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue focus:border-blue outline-none transition-all" placeholder="Confirm new password" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.dashboard.languagePreference}</label>
                <select name="language" value={profile.language} onChange={handleChange} className="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-blue focus:border-blue outline-none transition-all">
                  <option>English</option>
                  <option>German</option>
                  <option>Turkish</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.dashboard.timezone}</label>
                <select name="timezone" value={profile.timezone} onChange={handleChange} className="w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-blue focus:border-blue outline-none transition-all">
                  <option>Europe/Istanbul (GMT+3)</option>
                  <option>Europe/Berlin (GMT+1)</option>
                  <option>Europe/London (GMT)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end -mb-6">
          <Button 
            variant="link" 
            className="text-blue hover:text-blue/80 font-medium h-auto p-0"
            render={
              <Link to={`/mt/${profile.username || ''}`} target="_blank" className="flex items-center">
                <ExternalLink className="mr-1.5 h-4 w-4" />
                {t.dashboard.viewProfile}
              </Link>
            }
          />
        </div>
        
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button variant="destructive" onClick={async () => {
            await supabase.auth.signOut();
            localStorage.removeItem('userRole');
            window.location.href = '/';
          }}>
            {t.dashboard.logOut}
          </Button>
          <div className="flex gap-4">
            <Button variant="outline">{t.dashboard.cancel}</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? t.dashboard.saving : t.dashboard.saveProfileChanges}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServicesList() {
  const navigate = useNavigate();
  const { lang, t } = useI18n();
  const langPrefix = lang === 'en' ? '' : `/${lang}`;
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('clinic_id', user.id)
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          
          if (data && data.length > 0) {
            setServices(data);
          } else {
            // Fallback to default services if none exist
            const defaultServices = [
              { id: '1', name: "Hair Transplant Special Offer", category: "Hair Transplant", price: "€2,500", status: "Active", features: "FUE, 4000 Grafts, Hotel Included", image: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&q=80&w=150&h=150" },
              { id: '2', name: "Face Lift with Laser", category: "Aesthetics", price: "€3,200", status: "Active", features: "Non-surgical, Quick Recovery", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=150&h=150" },
              { id: '3', name: "Premium Dental Implants", category: "Dental", price: "€4,500", status: "Draft", features: "All-on-4, Lifetime Warranty", image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=150&h=150" },
              { id: '4', name: "Rhinoplasty Package", category: "Plastic Surgery", price: "€3,800", status: "Active", features: "VIP Transfer, 5-Star Hotel", image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=150&h=150" },
            ];
            setServices(defaultServices);
          }
        }
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setServices(services.filter(s => s.id !== id));
      
      // Also update local storage
      const savedServices = JSON.parse(localStorage.getItem('clinic_services') || '[]');
      const updatedSaved = savedServices.filter((s: any) => s.id !== id);
      localStorage.setItem('clinic_services', JSON.stringify(updatedSaved));
    } catch (err: any) {
      alert(`Error deleting service: ${err.message}`);
    }
  };

  if (loading) return <div>Loading services...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t.dashboard.myServicesOffers}</h2>
          <p className="text-muted-foreground">{t.dashboard.myServicesOffersDesc}</p>
        </div>
        <Button onClick={() => navigate(`${langPrefix}/dashboard/services/new`)}><Plus className="w-4 h-4 mr-2" /> {t.dashboard.addService}</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t.dashboard.activeListings}</CardTitle>
          <CardDescription>{t.dashboard.activeListingsDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">{t.dashboard.tableImage}</TableHead>
                <TableHead>{t.dashboard.tableServiceOffer}</TableHead>
                <TableHead>{t.dashboard.tableCategory}</TableHead>
                <TableHead>{t.dashboard.tablePrice}</TableHead>
                <TableHead>{t.dashboard.tableStatus}</TableHead>
                <TableHead className="text-right">{t.dashboard.tableActions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service, i) => (
                <TableRow key={service.id || i}>
                  <TableCell>
                    <img src={service.image} alt={service.name} className="w-16 h-16 object-cover rounded-md" referrerPolicy="no-referrer" />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      <AITranslate>{service.name}</AITranslate>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      <AITranslate>{service.features}</AITranslate>
                    </div>
                  </TableCell>
                  <TableCell>{service.category}</TableCell>
                  <TableCell className="font-medium">{service.price}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${service.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {service.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => {
                      const slug = service.name ? service.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `service-${service.id}`;
                      navigate(`${langPrefix}/chatmt/${slug}`);
                    }}>{t.dashboard.viewDetails}</Button>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`${langPrefix}/dashboard/services/edit/${service.id}`)}>{t.dashboard.edit}</Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(service.id)}>{t.dashboard.delete}</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function UserSettings() {
  const { t } = useI18n();
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    emailNotifications: true,
    smsAlerts: false
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (data) {
            setProfile({
              fullName: data.full_name || '',
              email: data.email || user.email || '',
              emailNotifications: true,
              smsAlerts: false
            });
          } else {
            setProfile(prev => ({ ...prev, email: user.email || '' }));
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setProfile(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: profile.fullName,
            email: profile.email
          })
          .eq('id', user.id);
          
        if (error) throw error;
        alert('✅ Settings saved successfully!');
      }
    } catch (err: any) {
      alert(`Error saving settings: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t.dashboard.settings}</h2>
        <p className="text-muted-foreground">{t.dashboard.accountSettingsDesc}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t.dashboard.profileInformation}</CardTitle>
            <CardDescription>{t.dashboard.profileInformationDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.dashboard.fullName}</label>
              <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue focus:border-blue outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t.dashboard.emailAddress}</label>
              <input type="email" name="email" value={profile.email} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue focus:border-blue outline-none transition-all" />
            </div>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? t.dashboard.saving : t.dashboard.saveChanges}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t.dashboard.notifications}</CardTitle>
            <CardDescription>{t.dashboard.notificationsDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t.dashboard.emailNotifications}</p>
                <p className="text-sm text-muted-foreground">{t.dashboard.emailNotificationsDesc}</p>
              </div>
              <input type="checkbox" name="emailNotifications" checked={profile.emailNotifications} onChange={handleChange} className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{t.dashboard.smsAlerts}</p>
                <p className="text-sm text-muted-foreground">{t.dashboard.smsAlertsDesc}</p>
              </div>
              <input type="checkbox" name="smsAlerts" checked={profile.smsAlerts} onChange={handleChange} className="w-4 h-4" />
            </div>
            <Button variant="outline" onClick={handleSave} disabled={isSaving}>{t.dashboard.updatePreferences}</Button>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8 pt-6 border-t">
        <Button variant="destructive" onClick={async () => {
          await supabase.auth.signOut();
          localStorage.removeItem('userRole');
          window.location.href = '/';
        }}>
          {t.dashboard.logOut}
        </Button>
      </div>
    </div>
  );
}

function RequestRow({ req, role }: { req: any, role: Role, key?: any }) {
  const { t } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState(req.status);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('request_messages')
        .select('*')
        .eq('request_id', req.id)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      if (data) setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  React.useEffect(() => {
    if (isExpanded) {
      fetchMessages();
    }
  }, [isExpanded, req.id]);

  const handleSendReply = async () => {
    if (!reply.trim()) return;
    setIsSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('request_messages')
        .insert([{
          request_id: req.id,
          sender_id: user.id,
          message: reply.trim()
        }]);

      if (error) throw error;
      
      setReply('');
      fetchMessages();
    } catch (err) {
      console.error('Error sending reply:', err);
      alert('Failed to send reply.');
    } finally {
      setIsSending(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const { error } = await supabase
        .from('requests')
        .update({ status: newStatus })
        .eq('id', req.id);
      
      if (error) throw error;
      setStatus(newStatus);
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <>
      <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => setIsExpanded(!isExpanded)}>
        <TableCell className="font-mono text-xs text-muted-foreground">
          #{req.id ? req.id.substring(0, 8).toUpperCase() : 'N/A'}
        </TableCell>
        <TableCell className="font-medium">
          {new Date(req.created_at).toLocaleDateString()}
        </TableCell>
        {role !== 'patient' && <TableCell>{req.full_name}</TableCell>}
        {role !== 'patient' && <TableCell>{req.phone}</TableCell>}
        {role === 'admin' && <TableCell className="text-xs text-muted-foreground truncate max-w-[100px]">{req.clinic_id}</TableCell>}
        <TableCell>
          <a href={req.service_link} target="_blank" rel="noopener noreferrer" className="text-blue hover:underline" onClick={(e) => e.stopPropagation()}>
            <AITranslate>{req.service_name}</AITranslate>
          </a>
        </TableCell>
        <TableCell className="max-w-[200px] truncate" title={req.message}>
          <AITranslate>{req.message}</AITranslate>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
              {status === 'Pending' ? t.dashboard.pending : status === 'Resolved' ? t.dashboard.resolved : t.dashboard.inProgress}
            </span>
          </div>
        </TableCell>
        <TableCell className="text-right">
          <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </TableCell>
      </TableRow>
      
      {isExpanded && (
        <TableRow className="bg-muted/20">
          <TableCell colSpan={role === 'admin' ? 9 : role !== 'patient' ? 8 : 6} className="p-0 border-b">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-lg mb-1">{t.dashboard.initialRequest}</h4>
                  <p className="text-sm text-gray-700 bg-white p-4 rounded-lg border shadow-sm">
                    <AITranslate>{req.message}</AITranslate>
                  </p>
                </div>
                {(role === 'clinic' || role === 'admin') && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{t.dashboard.updateStatus}</span>
                    <select 
                      value={status} 
                      onChange={(e) => handleStatusChange(e.target.value)}
                      disabled={isUpdatingStatus}
                      className="text-sm border rounded-md px-2 py-1 bg-white"
                    >
                      <option value="Pending">{t.dashboard.pending}</option>
                      <option value="In Progress">{t.dashboard.inProgress}</option>
                      <option value="Resolved">{t.dashboard.resolved}</option>
                    </select>
                  </div>
                )}
              </div>

              {messages.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm text-gray-500 uppercase tracking-wider">{t.dashboard.conversationHistory}</h4>
                  <div className="space-y-3">
                    {messages.map((msg, idx) => {
                      // Determine if the message is from the current user viewing it
                      // For simplicity, we'll just check if the sender is the patient or clinic based on role
                      // A more robust way would be to check msg.sender_id === currentUser.id
                      const isPatientSender = msg.sender_id === req.patient_id;
                      const isMyMessage = (role === 'patient' && isPatientSender) || (role === 'clinic' && !isPatientSender) || (role === 'admin' && msg.sender_id !== req.patient_id && msg.sender_id !== req.clinic_id);
                      
                      return (
                        <div key={msg.id || idx} className={`flex flex-col ${isMyMessage ? 'items-end' : 'items-start'}`}>
                          <div className={`max-w-[80%] p-3 rounded-lg ${isMyMessage ? 'bg-blue text-white rounded-tr-none' : 'bg-white border text-gray-800 rounded-tl-none'}`}>
                            <p className="text-sm whitespace-pre-wrap">
                              <AITranslate>{msg.message}</AITranslate>
                            </p>
                          </div>
                          <span className="text-xs text-gray-400 mt-1">
                            {new Date(msg.created_at).toLocaleString()} • {isPatientSender ? req.full_name : msg.sender_id === req.clinic_id ? 'Clinic' : 'Admin'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <textarea 
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder={t.dashboard.typeYourReply}
                  className="flex-1 min-h-[80px] p-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue focus:border-blue outline-none resize-y"
                />
                <Button 
                  onClick={handleSendReply} 
                  disabled={isSending || !reply.trim()}
                  className="self-end bg-blue hover:bg-blue-dark text-white"
                >
                  {isSending ? t.dashboard.sending : <><Send className="h-4 w-4 mr-2" /> {t.dashboard.reply}</>}
                </Button>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

function MyRequests({ role }: { role: Role }) {
  const { t } = useI18n();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  React.useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          let query = supabase.from('requests').select('*').order('created_at', { ascending: false });
          
          if (role === 'patient') {
            query = query.eq('patient_id', user.id);
          } else if (role === 'clinic') {
            query = query.eq('clinic_id', user.id);
          }
          // admin sees all
          
          const { data, error } = await query;
            
          if (error) throw error;
          
          if (data) {
            setRequests(data);
          }
        }
      } catch (err) {
        console.error('Error fetching requests:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [role]);

  const filteredRequests = requests.filter(req => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const shortId = req.id ? req.id.substring(0, 8).toLowerCase() : '';
    return (
      shortId.includes(searchLower) ||
      (req.full_name && req.full_name.toLowerCase().includes(searchLower)) ||
      (req.clinic_id && req.clinic_id.toLowerCase().includes(searchLower)) ||
      (req.service_name && req.service_name.toLowerCase().includes(searchLower))
    );
  });

  if (loading) return <div>Loading requests...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {t.dashboard.consultationRequests}
          </h2>
          <p className="text-muted-foreground">
            {t.dashboard.consultationRequestsDesc}
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t.dashboard.searchRequests}
            className="w-full pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t.dashboard.requests}</CardTitle>
          <CardDescription>
            {t.dashboard.consultationRequestsDesc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>{t.dashboard.tableDate}</TableHead>
                {role !== 'patient' && <TableHead>{t.dashboard.tablePatient}</TableHead>}
                {role !== 'patient' && <TableHead>{t.dashboard.tablePhone}</TableHead>}
                {role === 'admin' && <TableHead>{t.dashboard.tableClinic}</TableHead>}
                <TableHead>{t.dashboard.tableServiceOffer}</TableHead>
                <TableHead>{t.dashboard.tableMessage}</TableHead>
                <TableHead>{t.dashboard.tableStatus}</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={role === 'admin' ? 9 : role !== 'patient' ? 8 : 6} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? "No requests found matching your search." : "No requests yet."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((req, i) => (
                  <RequestRow key={req.id || i} req={req} role={role} />
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminClinicsList() {
  const [clinics, setClinics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { lang, t } = useI18n();
  const langPrefix = lang === 'en' ? '' : `/${lang}`;

  const fetchClinics = async () => {
    try {
      // First fetch all profiles with role clinic
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'clinic')
        .order('created_at', { ascending: false });
      
      if (profilesError) throw profilesError;

      // Then fetch their clinic settings
      const { data: settings, error: settingsError } = await supabase
        .from('clinic_settings')
        .select('*');
      
      if (settingsError) throw settingsError;

      // Merge the data
      const mergedClinics = (profiles || []).map(profile => ({
        ...profile,
        clinic_settings: settings?.find(s => s.id === profile.id) || null
      }));

      setClinics(mergedClinics);
    } catch (err: any) {
      console.error('Error fetching clinics:', err);
      alert(`Error fetching clinics: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchClinics();
  }, []);

  const toggleStatus = async (userId: string, currentStatus: boolean, field: 'is_active' | 'is_verified') => {
    setUpdatingId(userId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [field]: !currentStatus })
        .eq('id', userId);

      if (error) throw error;
      await fetchClinics();
    } catch (err: any) {
      alert(`Error updating clinic: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t.dashboard.clinicsManagement}</h2>
          <p className="text-muted-foreground">{t.dashboard.clinicsManagementDesc}</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t.dashboard.allClinics}</CardTitle>
          <CardDescription>{t.dashboard.allClinicsDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">{t.dashboard.loading}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.dashboard.tableName}</TableHead>
                  <TableHead>{t.dashboard.tableLocation}</TableHead>
                  <TableHead>{t.dashboard.tableUsername}</TableHead>
                  <TableHead>{t.dashboard.tableStatus}</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead className="text-right">{t.dashboard.tableActions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clinics.map((clinic) => {
                  const isActive = clinic.is_active ?? true;
                  const isVerified = clinic.is_verified ?? false;
                  const settings = clinic.clinic_settings;

                  return (
                    <TableRow key={clinic.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <AITranslate>{settings?.clinic_name || clinic.full_name || t.dashboard.unnamedClinic}</AITranslate>
                          {isVerified && <VerifiedBadge className="w-4 h-4" />}
                        </div>
                      </TableCell>
                      <TableCell>{settings?.city || settings?.address || t.dashboard.unknown}</TableCell>
                      <TableCell>{settings?.username || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={isActive ? "default" : "destructive"}>
                          {isActive ? t.dashboard.active : "Deactivated"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={isVerified ? "secondary" : "outline"} className={isVerified ? "bg-blue/10 text-blue border-blue/20" : ""}>
                          {isVerified ? "Verified" : "Unverified"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={updatingId === clinic.id}
                            onClick={() => toggleStatus(clinic.id, isVerified, 'is_verified')}
                          >
                            {isVerified ? "Unverify" : "Verify"}
                          </Button>
                          <Button 
                            variant={isActive ? "destructive" : "default"} 
                            size="sm" 
                            disabled={updatingId === clinic.id}
                            onClick={() => toggleStatus(clinic.id, isActive, 'is_active')}
                          >
                            {isActive ? "Deactivate" : "Activate"}
                          </Button>
                          {settings?.username && (
                            <Link to={`${langPrefix}/mt/${settings.username}`}>
                              <Button variant="ghost" size="sm">{t.dashboard.view}</Button>
                            </Link>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {clinics.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {t.dashboard.noClinicsFound}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AdminPatientsList() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { t } = useI18n();

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'patient')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      console.log('Fetched patients:', data);
      setPatients(data || []);
    } catch (err: any) {
      console.error('Error fetching patients:', err);
      alert(`Error fetching patients: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPatients();
  }, []);

  const toggleStatus = async (userId: string, currentStatus: boolean, field: 'is_active' | 'is_verified') => {
    setUpdatingId(userId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [field]: !currentStatus })
        .eq('id', userId);

      if (error) throw error;
      await fetchPatients();
    } catch (err: any) {
      alert(`Error updating patient: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t.dashboard.patientsManagement}</h2>
          <p className="text-muted-foreground">{t.dashboard.patientsManagementDesc}</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t.dashboard.allPatients}</CardTitle>
          <CardDescription>{t.dashboard.allPatientsDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">{t.dashboard.loading}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.dashboard.tableName}</TableHead>
                  <TableHead>{t.dashboard.tableEmail}</TableHead>
                  <TableHead>{t.dashboard.tableJoined}</TableHead>
                  <TableHead>{t.dashboard.tableStatus}</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead className="text-right">{t.dashboard.tableActions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {patient.full_name || t.dashboard.unnamedPatient}
                        {patient.is_verified && <VerifiedBadge className="w-4 h-4" />}
                      </div>
                    </TableCell>
                    <TableCell>{patient.email || '-'}</TableCell>
                    <TableCell>{new Date(patient.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={patient.is_active ? "default" : "destructive"}>
                        {patient.is_active ? t.dashboard.active : "Deactivated"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={patient.is_verified ? "secondary" : "outline"} className={patient.is_verified ? "bg-blue/10 text-blue border-blue/20" : ""}>
                        {patient.is_verified ? "Verified" : "Unverified"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          disabled={updatingId === patient.id}
                          onClick={() => toggleStatus(patient.id, patient.is_verified, 'is_verified')}
                        >
                          {patient.is_verified ? "Unverify" : "Verify"}
                        </Button>
                        <Button 
                          variant={patient.is_active ? "destructive" : "default"} 
                          size="sm" 
                          disabled={updatingId === patient.id}
                          onClick={() => toggleStatus(patient.id, patient.is_active, 'is_active')}
                        >
                          {patient.is_active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => window.location.href = `mailto:${patient.email}`}>
                          {t.dashboard.contact}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {patients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {t.dashboard.noPatientsFound}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


function DashboardLayoutContent() {
  const location = useLocation();
  const actualRole = (location.state as any)?.role || localStorage.getItem('userRole') || 'patient';
  
  // Ensure we save it if it came from navigation state
  React.useEffect(() => {
    if ((location.state as any)?.role) {
      localStorage.setItem('userRole', (location.state as any).role);
    }
  }, [location.state]);

  const [role, setRole] = useState<Role>(actualRole as Role);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { lang } = useI18n();
  const langPrefix = lang === 'en' ? '' : `/${lang}`;

  // Consolidate auth checks to prevent concurrent Supabase calls
  React.useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        // Use getSession first as it's faster and handles the initial lock
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!isMounted) return;

        if (!session) {
          setIsAuthenticated(false);
          navigate(langPrefix + '/');
          return;
        }

        setIsAuthenticated(true);
        const user = session.user;

        // Check if user is active
        const { data: currentProfile } = await supabase.from('profiles').select('role, is_active').eq('id', user.id).single();
        if (currentProfile && !currentProfile.is_active) {
          await supabase.auth.signOut();
          localStorage.removeItem('userRole');
          alert("Your account has been deactivated by the administrator.");
          navigate(langPrefix + '/');
          return;
        }

        // Now ensure admin status if applicable
        if (user && (user.email === 'turkishmag.com@gmail.com' || user.email === 'app.guzellik@gmail.com')) {
          if (isMounted && (!currentProfile || currentProfile.role !== 'admin')) {
            await supabase.from('profiles').upsert({ 
              id: user.id, 
              role: 'admin', 
              email: user.email,
              full_name: user.user_metadata?.full_name || 'Admin',
              is_active: true
            });
            console.log('Successfully set user as admin in database');
          }
        }
      } catch (err) {
        console.error('Error in auth initialization:', err);
        if (isMounted) setIsAuthenticated(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      if (!session) {
        setIsAuthenticated(false);
        navigate(langPrefix + '/');
      } else {
        setIsAuthenticated(true);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, langPrefix]);

  if (isAuthenticated === null) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <Navbar onOpenModal={() => setIsModalOpen(true)} />
        <div className="flex min-h-screen w-full bg-gray-50/50 pt-[60px]">
          <DashboardSidebar currentRole={role} onRoleChange={setRole} actualRole={actualRole} />
          <div className="flex-1 flex flex-col min-w-0">
            <DashboardHeader currentRole={role} />
            <main className="flex-1 p-6 overflow-auto pb-24">
              <div className="max-w-6xl mx-auto">
                <Routes>
                  <Route path="/" element={
                    role === 'admin' ? <AdminDashboard /> :
                    role === 'clinic' ? <ClinicDashboard /> :
                    <PatientDashboard />
                  } />
                  <Route path="clinics" element={<AdminClinicsList />} />
                  <Route path="patients" element={<AdminPatientsList />} />
                  <Route path="services" element={<ServicesList />} />
                  <Route path="services/new" element={<AddServicePage />} />
                  <Route path="services/edit/:id" element={<AddServicePage />} />
                  <Route path="requests" element={<MyRequests role={role} />} />
                  <Route path="settings" element={
                    role === 'clinic' ? <ClinicSettings /> : <UserSettings />
                  } />
                  <Route path="*" element={
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <LayoutDashboard className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h2 className="text-2xl font-bold tracking-tight mb-2">Page Under Construction</h2>
                      <p className="text-muted-foreground max-w-md">
                        This section of the dashboard is currently being built. Check back later!
                      </p>
                    </div>
                  } />
                </Routes>
              </div>
            </main>
          </div>
        </div>
        <BottomNav onOpenModal={() => setIsModalOpen(true)} />
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </SidebarProvider>
    </TooltipProvider>
  );
}

export function DashboardLayout({ lang }: { lang: Language }) {
  return (
    <I18nProvider lang={lang}>
      <DashboardLayoutContent />
    </I18nProvider>
  );
}
