/**
 * This class is used to configure packet id
 * and packet fields to receive from the
 * {@link DataStreamService}
 */
export class DataPacketFilter {
    packetId: number;
    fields: string[];

    constructor(packetId: number, fields: string[]) {
        this.packetId = packetId;
        this.fields = fields;
    }
}
