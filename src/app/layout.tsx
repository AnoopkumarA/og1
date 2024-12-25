import { SupabaseProvider } from '@/contexts/SupabaseContext'
import { Toaster } from '@/components/ui/toaster'

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body>
				<SupabaseProvider>
					{children}
					<Toaster />
				</SupabaseProvider>
			</body>
		</html>
	)
}