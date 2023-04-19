<script>
	import Page from "../components/Page.svelte";
</script>

<Page route="index">
	<table>
		<tr>
			<th>Q1</th>
			<td>
				<h2>Web page performance</h2>
				<p>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
					asperiores cupiditate quaerat distinctio, laborum nemo, minus commodi
					deserunt et temporibus incidunt alias debitis accusantium. Minima
					dolorem rerum corporis deleniti unde.
				</p>
			</td></tr
		>
	</table>
</Page>

<style>
	table {
		border-collapse: collapse;
	}
	th {
		font-family: "GuardianTextEgyptian";
		font-weight: 500;
		font-size: 1.75rem;
		vertical-align: top;
		padding-top: 1rem;
		padding-right: 2rem;
		line-height: 1.15;
	}
	td {
		border-left: var(--border);
		vertical-align: top;
		padding: 1rem;
	}

	h2 {
		font-size: 1.75rem;
		padding-bottom: 1.25rem;
	}
</style>
