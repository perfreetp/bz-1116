import { useState } from 'react';
import {
  XCircle,
  PackageX,
  FileText,
  MessageSquare,
  Search,
  Clock,
  CheckCircle,
  X,
  User,
  Phone,
  Send,
} from 'lucide-react';
import { mockTickets } from '@/data/tickets';
import { Ticket, TicketType, TicketStatus } from '@/types';
import {
  getTicketTypeText,
  getTicketStatusText,
} from '@/utils/format';

const tabs: { value: string; label: string; icon: typeof XCircle; color: string }[] = [
  { value: 'all', label: '全部工单', icon: FileText, color: 'text-gray-500' },
  { value: 'cancel', label: '取消申请', icon: XCircle, color: 'text-amber-500' },
  { value: 'lost', label: '遗失申报', icon: PackageX, color: 'text-red-500' },
  { value: 'compensation', label: '赔付申请', icon: FileText, color: 'text-orange-500' },
  { value: 'complaint', label: '差评回访', icon: MessageSquare, color: 'text-purple-500' },
];

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-500',
};

export const ServiceCenter = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [searchText, setSearchText] = useState('');

  const filteredTickets = tickets.filter((t) => {
    if (activeTab !== 'all' && t.type !== activeTab) return false;
    if (searchText && !t.orderId.includes(searchText) && !t.description.includes(searchText)) return false;
    return true;
  });

  const pendingCount = tickets.filter((t) => t.status === 'pending').length;

  const handleAccept = (ticket: Ticket) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticket.id
          ? { ...t, status: 'processing' as TicketStatus, handler: '客服小王' }
          : t
      )
    );
    setSelectedTicket({
      ...ticket,
      status: 'processing',
      handler: '客服小王',
    });
  };

  const handleResolve = (ticket: Ticket) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticket.id
          ? { ...t, status: 'resolved' as TicketStatus, handleNotes: replyText }
          : t
      )
    );
    setShowDetail(false);
    setSelectedTicket(null);
  };

  const handleClose = (ticket: Ticket) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticket.id
          ? { ...t, status: 'closed' as TicketStatus, handleNotes: replyText }
          : t
      )
    );
    setShowDetail(false);
    setSelectedTicket(null);
  };

  const openDetail = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowDetail(true);
    setReplyText('');
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">客服处理中心</h1>
          <p className="text-gray-500 text-sm mt-1">
            处理用户工单，提供优质服务
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索订单号或内容..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-white rounded-xl text-sm w-64 shadow-soft focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>
          <div className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-sm font-medium">
            待处理 {pendingCount}
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="flex overflow-x-auto border-b border-gray-100">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const count =
                  tab.value === 'all'
                    ? tickets.length
                    : tickets.filter((t) => t.type === tab.value).length;

                return (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap transition-colors relative ${
                      activeTab === tab.value
                        ? 'text-primary-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${tab.color}`} />
                    {tab.label}
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">
                      {count}
                    </span>
                    {activeTab === tab.value && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="divide-y divide-gray-50 max-h-[calc(100vh-20rem)] overflow-y-auto">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => openDetail(ticket)}
                    className={`p-4 hover:bg-warm-50 cursor-pointer transition-colors ${
                      ticket.status === 'pending' ? 'bg-amber-50/30' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            statusColors[ticket.status]
                          }`}
                        >
                          {getTicketStatusText(ticket.status)}
                        </span>
                        <span className="text-sm text-gray-400">
                          {getTicketTypeText(ticket.type)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">{ticket.createdAt}</span>
                    </div>

                    <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                      {ticket.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {ticket.customerName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          {ticket.customerPhone}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        订单号：{ticket.orderId}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-16 text-center">
                  <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">暂无工单</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showDetail && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-slide-up flex flex-col">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-gray-800">工单详情</h2>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    statusColors[selectedTicket.status]
                  }`}
                >
                  {getTicketStatusText(selectedTicket.status)}
                </span>
              </div>
              <button
                onClick={() => setShowDetail(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">工单类型</p>
                  <p className="text-sm font-medium text-gray-800">
                    {getTicketTypeText(selectedTicket.type)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">关联订单</p>
                  <p className="text-sm font-mono text-gray-800">
                    {selectedTicket.orderId}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">客户姓名</p>
                  <p className="text-sm font-medium text-gray-800">
                    {selectedTicket.customerName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">联系电话</p>
                  <p className="text-sm font-medium text-gray-800">
                    {selectedTicket.customerPhone}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">提交时间</p>
                  <p className="text-sm text-gray-800">{selectedTicket.createdAt}</p>
                </div>
                {selectedTicket.handler && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">处理人</p>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedTicket.handler}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-warm-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-2">问题描述</p>
                <p className="text-sm text-gray-700">{selectedTicket.description}</p>
              </div>

              {selectedTicket.handleNotes && (
                <div className="bg-secondary-50 rounded-xl p-4">
                  <p className="text-xs text-secondary-600 mb-2">处理结果</p>
                  <p className="text-sm text-secondary-700">
                    {selectedTicket.handleNotes}
                  </p>
                </div>
              )}

              {selectedTicket.status === 'pending' && (
                <button
                  onClick={() => handleAccept(selectedTicket)}
                  className="w-full py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
                >
                  受理工单
                </button>
              )}

              {selectedTicket.status === 'processing' && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    处理回复
                  </p>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="请输入处理意见..."
                    rows={4}
                    className="w-full px-4 py-3 bg-warm-50 rounded-xl text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleResolve(selectedTicket)}
                      disabled={!replyText}
                      className="flex-1 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle className="w-4 h-4 inline mr-1" />
                      解决工单
                    </button>
                    <button
                      onClick={() => handleClose(selectedTicket)}
                      disabled={!replyText}
                      className="flex-1 py-3 bg-gray-500 text-white rounded-xl font-medium hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <XCircle className="w-4 h-4 inline mr-1" />
                      关闭工单
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
