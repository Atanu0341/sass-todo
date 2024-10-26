import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import { Skeleton } from './ui/skeleton'

function LoadingSkeleton() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mx-auto" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </CardFooter>
        </Card>
      </div>
    )
}

export default LoadingSkeleton