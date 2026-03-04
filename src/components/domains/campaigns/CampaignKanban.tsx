'use client';

import { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { updateCampaignStatus } from '@/app/actions/campaigns';
import { toast } from 'react-hot-toast';

export type CampaignKanbanType = {
    id: number;
    name: string;
    advertiser: string;
    budget: number;
    roas: number;
    status: string;
};

// --- Sortable Item Component ---
function SortableCampaignCard({ campaign }: { campaign: CampaignKanbanType }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: campaign.id.toString() });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow relative overflow-hidden group"
        >
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate pr-4">{campaign.name}</h4>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">{campaign.advertiser}</p>
            <div className="flex justify-between items-end text-sm">
                <div>
                    <span className="block text-zinc-400 text-xs">Budget</span>
                    <span className="font-mono text-zinc-800 dark:text-zinc-200">{campaign.budget.toLocaleString()}₩</span>
                </div>
                <div className="text-right">
                    <span className="block text-zinc-400 text-xs">ROAS</span>
                    <span className={`font-medium ${campaign.roas > 200 ? 'text-green-500' : 'text-amber-500'}`}>
                        {campaign.roas}%
                    </span>
                </div>
            </div>
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
    );
}

// --- Kanban Column Component ---
function KanbanColumn({ id, title, campaigns }: { id: string, title: string, campaigns: CampaignKanbanType[] }) {
    return (
        <div className="flex-1 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-4 min-w-[300px] border border-zinc-100 dark:border-zinc-800 flex flex-col h-[700px]">
            <div className="flex justify-between items-center mb-4 px-2">
                <h3 className="font-bold text-zinc-700 dark:text-zinc-300">{title}</h3>
                <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs py-1 px-2.5 rounded-full font-medium">
                    {campaigns.length}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-4 px-1">
                <SortableContext
                    id={id}
                    items={campaigns.map(c => c.id.toString())}
                    strategy={verticalListSortingStrategy}
                >
                    {campaigns.map((campaign) => (
                        <SortableCampaignCard key={campaign.id} campaign={campaign} />
                    ))}
                    {campaigns.length === 0 && (
                        <div className="h-full flex items-center justify-center text-sm text-zinc-400 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                            Drag cards here
                        </div>
                    )}
                </SortableContext>
            </div>
        </div>
    );
}

// --- Main Board Export ---
export function CampaignKanban({ initialCampaigns }: { initialCampaigns: CampaignKanbanType[] }) {
    const [campaigns, setCampaigns] = useState(initialCampaigns);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;

        const activeCampaignId = parseInt(active.id.toString());
        const overId = over.id.toString();

        // Find the current campaign being dragged
        const activeCampaign = campaigns.find(c => c.id === activeCampaignId);
        if (!activeCampaign) return;

        // Detect if dropped over a column directly OR over another item in a column
        let newStatus = activeCampaign.status;

        // Valid column IDs mapping
        const validColumns = ['draft', 'pending_approval', 'active', 'paused', 'ended', 'rejected'];

        if (validColumns.includes(overId)) {
            // Dropped directly onto an empty column container
            newStatus = overId;
        } else {
            // Dropped onto another item, find that item's status
            const targetCampaign = campaigns.find(c => c.id.toString() === overId);
            if (targetCampaign) {
                newStatus = targetCampaign.status;
            }
        }

        if (activeCampaign.status !== newStatus) {
            // Optimistic upate UI
            setCampaigns((prev) =>
                prev.map(c => c.id === activeCampaignId ? { ...c, status: newStatus } : c)
            );

            // Server Mutation
            try {
                await updateCampaignStatus(activeCampaignId, newStatus);
                toast.success(`Moved to ${newStatus.replace('_', ' ')}`);
            } catch (err: any) {
                toast.error(err.message || 'Permission denied: Cannot change status.');
                // Revert on fail
                setCampaigns((prev) =>
                    prev.map(c => c.id === activeCampaignId ? { ...c, status: activeCampaign.status } : c)
                );
            }
        } else {
            // Reordering within same column (Cosmetic only for now)
            const activeIndex = campaigns.findIndex(c => c.id === activeCampaignId);
            const overIndex = campaigns.findIndex(c => c.id.toString() === overId);
            if (activeIndex !== overIndex) {
                setCampaigns((items) => arrayMove(items, activeIndex, overIndex));
            }
        }
    };

    const draft = campaigns.filter(c => c.status === 'draft');
    const pending = campaigns.filter(c => c.status === 'pending_approval');
    const active = campaigns.filter(c => c.status === 'active');
    const ended = campaigns.filter(c => ['paused', 'ended', 'rejected'].includes(c.status));

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-6 overflow-x-auto pb-6 pt-2">
                <KanbanColumn id="draft" title="Draft (기획)" campaigns={draft} />
                <KanbanColumn id="pending_approval" title="Approval (결재 대기)" campaigns={pending} />
                <KanbanColumn id="active" title="Active (진행 중)" campaigns={active} />
                <KanbanColumn id="ended" title="Ended / Paused (보류)" campaigns={ended} />
            </div>
        </DndContext>
    );
}
