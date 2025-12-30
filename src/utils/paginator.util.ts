/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export interface CursorPaginatedResult<T> {
  data: T[];
  metadata: {
    nextCursor: string | null;
    hasNextPage: boolean;
    limit: number;
  };
}

export class CursorPaginator {
  public cursor: string | null;
  public limit: number;

  constructor(cursor?: string, limit?: number | string) {
    this.limit = parseInt(limit as string, 10) || 10;
    if (this.limit < 1) this.limit = 10;

    this.cursor = cursor || null;
  }

  getMetadata(data: any[], hasNextPage: boolean) {
    const lastItem = data.length > 0 ? data[data.length - 1] : null;

    return {
      nextCursor: hasNextPage && lastItem ? lastItem.id.toString() : null,
      hasNextPage,
      limit: this.limit,
    };
  }
}
