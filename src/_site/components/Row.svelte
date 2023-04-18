<div class="row">
	<div>
		<slot name="title" />
	</div>

	<div class="info">
		<slot name="info" />
	</div>
</div>

<style>
	.row {
		border-top: 1px solid #999;
		display: grid;
		grid-template-columns: 1fr 3fr;
		gap: 2rem;
	}

	.row > * {
		padding-top: 0.5rem;
	}

	.row .info {
		display: flex;
		flex-direction: column;
		list-style-type: none;
		padding-left: 1rem;
		border-left: 1px solid #999;
	}
</style>
