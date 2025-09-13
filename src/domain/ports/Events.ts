export interface DomainEvent {
	eventType: string;
	aggregateId: string;
	occurredAt: Date;
	data: any;
}

export interface EventPublisher {
	publish(event: DomainEvent): Promise<void>;
}
