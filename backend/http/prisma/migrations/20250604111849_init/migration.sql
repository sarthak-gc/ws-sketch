-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "hexCode" TEXT NOT NULL DEFAULT '000000',
    "isOnline" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Tabs" (
    "tabId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tabName" TEXT NOT NULL DEFAULT 'New Tab',
    "elements" TEXT,
    "isEditable" BOOLEAN NOT NULL DEFAULT false,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "accessCode" TEXT,
    "accessCodeExpiration" TIMESTAMP(3),
    "sharableLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tabs_pkey" PRIMARY KEY ("tabId")
);

-- CreateTable
CREATE TABLE "_user-collaboration" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_user-collaboration_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "_user-collaboration_B_index" ON "_user-collaboration"("B");

-- AddForeignKey
ALTER TABLE "Tabs" ADD CONSTRAINT "Tabs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user-collaboration" ADD CONSTRAINT "_user-collaboration_A_fkey" FOREIGN KEY ("A") REFERENCES "Tabs"("tabId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_user-collaboration" ADD CONSTRAINT "_user-collaboration_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
